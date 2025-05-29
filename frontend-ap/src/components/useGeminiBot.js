import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyC1zn-_Uko1IbRGqD1HuDDWwucAk-h55zI";

/** @type {any} */
const puter = window.puter;

export const MODELS = {
  GEMINI: 'gemini',
  GPT: 'gpt',
  GROK: 'grok'
};

const useAIBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentModel, setCurrentModel] = useState(MODELS.GEMINI);

  const sendMessageToGemini = async (message) => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = {
      contents: [{
        parts: [{
          text: message
        }]
      }]
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const sendMessageToPuter = async (message, modelName) => {
    try {
      const response = await puter.ai.chat(message, {
        model: modelName === MODELS.GPT ? "gpt-4o" : "x-ai/grok-3-beta",
        system: "You are Vaani, a helpful fact-checking assistant. Provide clear and accurate responses."
      });
      
      // Handle streaming response if needed
      if (response && typeof response[Symbol.asyncIterator] === 'function') {
        let fullResponse = '';
        for await (const part of response) {
          fullResponse += part.text || '';
        }
        return fullResponse;
      }
      
      // Handle non-streaming response
      if (typeof response === 'object' && response.message) {
        return response.message.content;
      }
      
      // Fallback
      return typeof response === 'string' ? response : response.toString();
    } catch (error) {
      console.error('Puter.js Error:', error);
      throw new Error(`Failed to get response from ${modelName.toUpperCase()}`);
    }
  };

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (currentModel === MODELS.GEMINI) {
        response = await sendMessageToGemini(message);
      } else {
        response = await sendMessageToPuter(message, currentModel);
      }

      setIsLoading(false);
      return response;

    } catch (err) {
      console.error("AI API Error:", err);
      setError(err.message || "Failed to get response from AI");
      setIsLoading(false);
      throw new Error(err.message || "Failed to connect to AI service");
    }
  }, [currentModel]);

  const toggleModel = () => {
    setCurrentModel(prev => {
      switch (prev) {
        case MODELS.GEMINI:
          return MODELS.GPT;
        case MODELS.GPT:
          return MODELS.GROK;
        default:
          return MODELS.GEMINI;
      }
    });
  };

  return {
    sendMessage,
    isLoading,
    error,
    currentModel,
    toggleModel,
    MODELS
  };
};

export default useAIBot; 