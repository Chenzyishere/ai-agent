import { useSettingsStore, providers } from '@/stores/useSettingsStore';

export const createChatCompletion = async (messages) => {
  const settings = useSettingsStore.getState().settings;
  const { provider, apiKey, model, stream, maxTokens, temperature, topP, topK } = settings;

  const providerConfig = providers[provider];
  const baseURL = providerConfig?.baseURL || 'https://api.siliconflow.cn/v1';
  const format = providerConfig?.format || 'openai';

  if (format === 'anthropic') {
    return anthropicChatCompletion(baseURL, messages, apiKey, model, stream, maxTokens, temperature, topP);
  }

  if (format === 'gemini') {
    return geminiChatCompletion(messages, apiKey, model, stream, maxTokens, temperature, topP);
  }

  // OpenAI 兼容格式 (SiliconFlow / DeepSeek / OpenAI / Moonshot / Zhipu)
  const payload = { model, messages, stream, max_tokens: maxTokens, temperature, top_p: topP, top_k: topK };
  const startTime = Date.now();

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status:${response.status}`);
  }

  if (stream) return response;

  const data = await response.json();
  const duration = (Date.now() - startTime) / 1000;
  const completionTokens = data.usage?.completionTokens || 0;
  data.speed = duration > 0 ? (completionTokens / duration).toFixed(2) : '0.00';
  return data;
};

// Anthropic Messages API 格式
async function anthropicChatCompletion(baseURL, messages, apiKey, model, stream, maxTokens, temperature, topP) {
  const systemMsgs = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const chatMsgs = messages.filter((m) => m.role !== 'system');

  const payload = {
    model,
    messages: chatMsgs,
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    stream,
  };
  if (systemMsgs.length > 0) {
    payload.system = systemMsgs.join('\n\n');
  }

  const response = await fetch(`${baseURL}/v1/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic error! status:${response.status} body:${errBody.slice(0, 200)}`);
  }

  if (stream) {
    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let tokens = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data:')) continue;
              try {
                const json = JSON.parse(trimmed.slice(5));
                const delta = json.type === 'content_block_delta' ? json.delta?.text || '' : '';
                tokens = json.usage?.output_tokens || tokens;
                if (delta) {
                  const sseChunk = `data: ${JSON.stringify({
                    choices: [{ delta: { content: delta } }],
                    usage: { completion_tokens: tokens },
                  })}\n\n`;
                  controller.enqueue(new TextEncoder().encode(sseChunk));
                }
              } catch (_) {}
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        },
      }),
      { headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  const data = await response.json();
  const text = data.content?.map((c) => c.text || '').join('') || '';
  return {
    choices: [{ message: { content: text, reasoning_content: '' } }],
    usage: { completionTokens: data.usage?.output_tokens || 0 },
    speed: '0.00',
  };
}

// Gemini API
async function geminiChatCompletion(messages, apiKey, model, stream, maxTokens, temperature, topP) {
  const systemMsgs = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const chatMsgs = messages.filter((m) => m.role !== 'system');

  const contents = chatMsgs.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const params = { generationConfig: { temperature, topP, maxOutputTokens: maxTokens } };
  if (systemMsgs.length > 0) {
    params.systemInstruction = { parts: [{ text: systemMsgs.join('\n\n') }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${stream ? 'streamGenerateContent' : 'generateContent'}?alt=${stream ? 'sse' : 'json'}&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, ...params }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini error! status:${response.status} body:${errBody.slice(0, 200)}`);
  }

  if (stream) {
    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let tokens = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data:')) continue;
              try {
                const json = JSON.parse(trimmed.slice(5));
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
                tokens = json.usageMetadata?.candidatesTokenCount || tokens;
                const sseChunk = `data: ${JSON.stringify({
                  choices: [{ delta: { content: text } }],
                  usage: { completion_tokens: tokens },
                })}\n\n`;
                controller.enqueue(new TextEncoder().encode(sseChunk));
              } catch (_) {}
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        },
      }),
      { headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return {
    choices: [{ message: { content: text, reasoning_content: '' } }],
    usage: { completionTokens: data.usageMetadata?.candidatesTokenCount || 0 },
    speed: '0.00',
  };
}

export default { name: 'api', createChatCompletion };
