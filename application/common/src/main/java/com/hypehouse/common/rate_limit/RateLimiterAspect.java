package com.hypehouse.common.rate_limit;

import com.hypehouse.common.exception.RateLimitExceededException;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
public class RateLimiterAspect {

    private final RateLimiterRegistry rateLimiterRegistry;

    // Cache the rate limiters to avoid creating them repeatedly
    private final Map<String, RateLimiter> rateLimiterCache = new HashMap<>();

    @Autowired
    public RateLimiterAspect(RateLimiterRegistry rateLimiterRegistry) {
        this.rateLimiterRegistry = rateLimiterRegistry;
    }

    @Before("@annotation(rateLimit)")
    public void checkRateLimit(JoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        RateLimit annotation = method.getAnnotation(RateLimit.class);

        if (annotation != null) {
            // Read annotation parameters
            int limitForPeriod = annotation.limitForPeriod();
            int limitRefreshPeriod = annotation.limitRefreshPeriod();

            // Create a unique key for each method's rate limiter
            String rateLimiterKey = method.getDeclaringClass().getName() + "." + method.getName();

            // Use cached rate limiter if available, otherwise create a new one
            RateLimiter rateLimiter = rateLimiterCache.computeIfAbsent(rateLimiterKey, key -> {
                // Create a RateLimiterConfig with custom settings
                RateLimiterConfig config = RateLimiterConfig.custom()
                        .limitForPeriod(limitForPeriod)
                        .limitRefreshPeriod(Duration.ofSeconds(limitRefreshPeriod))
                        .timeoutDuration(Duration.ofSeconds(0)) // Timeout duration set to 0s
                        .build();

                return rateLimiterRegistry.rateLimiter(key, config);
            });

            // Check if permission can be acquired
            boolean permissionGranted = rateLimiter.acquirePermission();
            if (!permissionGranted) {
                throw new RateLimitExceededException("Rate limit exceeded for method: " + method.getName());
            }
        }
    }
}
