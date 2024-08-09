package com.ssafy.ozz.clothes.clothes.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ozz.clothes.clothes.dto.request.ExtractAttribute;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MqService {
    private final StreamBridge streamBridge;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public void send(List<ExtractAttribute> extractAttribute) {
        try {
            String message = objectMapper.writeValueAsString(extractAttribute);
//            streamBridge.send("imageProcess-out-0", message);
//            streamBridge.send("extractAttribute-out-0", message);
            rabbitTemplate.convertAndSend("image-process", "", message);
            rabbitTemplate.convertAndSend("extract-attribute", "", message);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }
}