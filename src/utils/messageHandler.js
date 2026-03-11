import { data } from "react-router";

export const messageHandler = {
  formatMessage(role, content, reasoning_content = '', files = []) {
    return {
      id: Date.now(),
      role,
      content,
      reasoning_content,
      files,
      completion_tokens: 0,
      speed: 0,
      loading: false,
    };
  },

  // 统一的响应处理函数
  async handleResponse(response, isStream, updateCallback) {
    if(!response){
      console.error('handleResponse:Response object is missing');
      throw new Error('No response received from API')
    }

    if (isStream) {
      this.handleStreamResponse(response, updateCallback);
    } else {
      // 非流式响应直接传入response对象
      this.handleNormalResponse(response, updateCallback);
    }
  },

  // 处理非流式响应
  // 全部直接回调
  handleNormalResponse(data, updateCallback) {
    // 1.安全检查：检查choices是否存在且不为空
    if(!data.choices || !Array.isArray(data.choices) || data.choices.length === 0){
      console.error('API Response Error:No choices found in response', data);
      
      // 尝试提取错误信息
      const errorMsg = data.error?.message || 'API returned no content (choices is empty/undefined)';
      throw new Error(errorMsg);
    }

    const choice = data.choices[0];

    // 2.安全检查:检查message是否存在
    if(!choice.message){
      console.error('API Response Error: No message in choice',choice);
      throw new Error('API returned a choice but no message content');
    }
    
    const content = choice.message.content || '';
    const reasoning = choice.message.reasoning_content || '';

    // 3.安全检查：处理usage可能缺失的情况
    const usage = data.usage || {};
    const tokens = usage.completion_tokens || usage.completionTokens || 0;

    // 4.速度计算
    const speed = data.speed || '0.00';
    
    updateCallback(
      content,
      reasoning,
      tokens,
      speed
    );
  },

  //   处理流式响应
  async handleStreamResponse(response, updateCallback) {
    if (!response || !response.body) {
      console.log(
        'handleStreamResponse,Response or response.body is undefined',
        response,
      );
    }
    // 需要用reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';
    let accumulatedReasoning = '';
    let startTime = Date.now();

    while (true) {
      // 这里是调用流式响应的核心，持续监听reader.read,然后如果返回done就停止
      // 使用await确保按照顺序处理每个数据块
      const { done, value } = await reader.read();
      if (done) break;

      // 这里是SSE协议的解析，正确处理SSE格式(data:前缀)
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        const trimmedLine = line.trim();
        if(!trimmedLine) continue;

        if (trimmedLine === 'data: [DONE]' || trimmedLine === 'data:[DONE]') continue;
        if (trimmedLine.startsWith('data:')) {
          // JSON的解析切片之后，从字符串中的第六个字符开始截取，一处SSE协议的data前缀
          const data = JSON.parse(line.slice(5));
          // 获取回复的文本，访问Choices[0].delta获取本次数据块的增量内容
          const content = data.choices[0].delta.content || '';
          // 获取深度思考的内容
          const reasoning = data.choices[0].delta.reasoning_content || '';
          // 字符串拼接，自加
          accumulatedContent += content;
          accumulatedReasoning += reasoning;

          // 通过回调更新消息
          updateCallback(
            accumulatedContent,
            accumulatedReasoning,
            // 计算并传递tokens使用量和速度
            data.usage?.completion_tokens || 0,
            (
              (data.usage?.completion_tokens || 0) /
              ((Date.now() - startTime) / 1000)
            ).toFixed(2),
          );
        }
      }
    }
  },
};
