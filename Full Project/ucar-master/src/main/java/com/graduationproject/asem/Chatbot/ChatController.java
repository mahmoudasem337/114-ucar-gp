package com.graduationproject.asem.Chatbot;

import java.util.Map;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

@CrossOrigin(origins = "http://localhost:5173") 
@RestController
public class ChatController {

    private final OllamaChatModel chatModel;
    public ChatController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @PostMapping("/ai/generate")
    public Map<String,String> generate(@RequestParam(value = "message", defaultValue = "Hi, Deepseek") String message) {
        return Map.of("generation", this.chatModel.call(message));
    }

    @PostMapping("/ai/generateStream")
    public Flux<ChatResponse> generateStream(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        Prompt prompt = new Prompt(new UserMessage(message));
        return this.chatModel.stream(prompt);
    }

}