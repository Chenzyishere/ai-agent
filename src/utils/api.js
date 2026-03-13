// 该函数处理接入的api

// 依赖导入
import { useSettingsStore } from "@/stores/useSettingsStore";
// 常量定义:硅基流动API地址
const API_BASE_URL = 'https://api.siliconflow.cn/v1';

/**
 * 创建聊天完成请求
 * @param {Array} messages - 对话消息历史数组
 * @returns {Promise<Response|Object>} - 流式模式下返回 Response 对象，非流式返回 JSON 数据对象
 */

export const createChatCompletion = async (messages) =>{
    const settings = useSettingsStore.getState().settings;
    const { apiKey,model,stream,maxTokens,temperature,topP,topK} =settings;

    // 构建请求载荷(Payload)
    const payload = {
        model:model,
        messages:messages,
        stream:stream,
        max_tokens:maxTokens,
        temperature:temperature,
        top_p:topP,
        top_k:topK
    };
    
    // 构建请求配置(Options)
    const Options = {
        method:'POST',
        headers:{
            'Authorization':`Bearer ${apiKey}`,
            'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
    };

    try {
        // 记录开始时间(本地计时)
        const startTime = Date.now()

        // 发送HTTP请求
        // fetch返回一个Promise,await 等待网络响应
        const response = await fetch(`${API_BASE_URL}/chat/completions`,Options)

        // 处理HTTP错误状态
        if(!response.ok){
            throw new Error(`HTTP error! status:${response.status}`);
        }

        // 根据设置判断返回模式(流式响应/非流式响应)
        if(stream){
            // 流式响应，直接返回原始的Response对象
            return response;
        } else {
            // 非流式响应，等待完整响应并解析为JSON
            const data = await response.json();
            
            // 计算耗时(秒)
            const duration = (Date.now() -startTime)/1000;
            
            // //计算生成速度(tokens/秒)
            // // 防止除以0或数据缺失
            const completionTokens = data.usage?.completionTokens || 0;
            const speed = duration > 0 ? (completionTokens / duration).toFixed(2):'0.00';

            // 将速度信息附加到返回数据
            data.speed = speed;
            return data;
        }

    }catch(error) {
        console.log('Chat API Error:',error);
        throw error;
    }
}

    // 默认导出
    export default {
        name:'api',
        createChatCompletion
    }

