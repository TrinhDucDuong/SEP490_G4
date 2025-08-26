package com.fourfingers.quangvinhstore.usecase.interactor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Collections;

@Component
public class StockInteraction {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private DefaultRedisScript<Long> stockScript;

    public StockInteraction() throws Exception {
        stockScript = new DefaultRedisScript<>();
        stockScript.setResultType(Long.class);

        String script = new String(Files.readAllBytes(
                new ClassPathResource("stock_deduct.lua").getFile().toPath()
        ), StandardCharsets.UTF_8);

        stockScript.setScriptText(script);
    }

    public boolean deductStock(Long productId, int quantity) {
        String key = "product:" + productId + ":stock";
        Long result = redisTemplate.execute(
                stockScript,
                Collections.singletonList(key),
                quantity
        );
        return result != null && result == 1L;
    }
}

