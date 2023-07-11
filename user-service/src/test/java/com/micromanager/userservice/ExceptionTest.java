package com.micromanager.userservice;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

import com.micromanager.userservice.exception.ErrorDetails;


public class ExceptionTest {

    @Test
    public void errorDetailsExceptionTest() throws Exception {
        LocalDateTime ldt = LocalDateTime.now();
        String message = "error";
        String details = "details";

        ErrorDetails errorDetails = new ErrorDetails(ldt, message, details);

        assertEquals(details, errorDetails.getDetails());
        assertEquals(message, errorDetails.getMessage());
        assertEquals(ldt, errorDetails.getTimestamp());

        ErrorDetails errorDetails2 = ErrorDetails.builder()
            .timestamp(ldt)
            .details(details)
            .message(message)
            .build();

        assertEquals(details, errorDetails2.getDetails());
        assertEquals(message, errorDetails2.getMessage());
        assertEquals(ldt, errorDetails2.getTimestamp());

        ErrorDetails errorDetails3 = new ErrorDetails();
        errorDetails3.setDetails(details);
        errorDetails3.setTimestamp(ldt);
        errorDetails3.setMessage(message);

        assertEquals(details, errorDetails3.getDetails());
        assertEquals(message, errorDetails3.getMessage());
        assertEquals(ldt, errorDetails3.getTimestamp());

        assertEquals("ErrorDetails.ErrorDetailsBuilder(timestamp=null, message=null, details=null)", ErrorDetails.builder().toString());
    }
}
