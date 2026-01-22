package projecct.pyeonhang.common.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import projecct.pyeonhang.common.dto.ApiResponse;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CommonExceptionHandler {

    /**
     * 1. @Valid 검증 실패 (400 Bad Request)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        log.warn("Validation failed: {}", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), errorMessage));
    }

    /**
     * 2. 비즈니스 로직 예외 (IllegalArgumentException - 400)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("Business logic error: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
    }

    /**
     * 3. 데이터 제약 조건 위반 (DB 중복 등 - 400)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(DataIntegrityViolationException e) {
        log.warn("Data integrity violation: {}", e.getMessage());
        // 이메일 중복 등의 상황에서 발생합니다.
        return ResponseEntity.badRequest()
                .body(ApiResponse.fail(400, "이미 사용 중인 정보이거나 조건에 맞지 않습니다."));
    }

    /**
     * 4. 보안 관련 예외 (Security 필터가 처리하도록 다시 던짐)
     */
    @ExceptionHandler({AuthenticationCredentialsNotFoundException.class, AccessDeniedException.class})
    public void handleSecurityException(RuntimeException e) {
        throw e;
    }

    /**
     * 5. 최상위 공통 예외 처리 (500 Internal Server Error)
     * 기존의 handleException, handleRunTimeException을 하나로 통합했습니다.
     */
    @ExceptionHandler({RuntimeException.class, Exception.class})
    public ResponseEntity<ApiResponse<Object>> handleAllException(Exception e) {
        // 보안 예외가 섞여 들어올 경우를 대비한 2차 체크
        if (e instanceof AccessDeniedException || e instanceof AuthenticationCredentialsNotFoundException) {
            throw (RuntimeException) e;
        }

        log.error("Unexpected Error: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 내부 오류가 발생했습니다."));
    }
}