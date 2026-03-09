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
    if (!response || !response.body) {
      console.log(
        'handleResponese,Response or response.body is updefined',
        response,
      );
    }
    if (isStream) {
      await this.handleStreamResponse(response, updateCallback);
    } else {
      this.handleNormalResponse(response, updateCallback);
    }
  },

  // 处理非流式响应
  // 全部直接回调
  handleNormalResponse(response, updateCallback) {
    updateCallback(
      response.choices[0].message.content,
      response.choices[0].message.reasoning_content || '',
      response.usage.completion_tokens,
      response.speed,
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
        if (line === 'data:[DONE]') continue;
        if (line.startsWith('data:')) {
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
