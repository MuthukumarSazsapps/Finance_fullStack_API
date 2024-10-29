// todo discuss
const HttpStatusCode = {
  // Informational 1xx
  CONTINUE: 100, // Continue with the request
  SWITCHING_PROTOCOLS: 101, // The requester has asked the server to switch protocols
  PROCESSING: 102, // Server is processing the request, but no final response is available yet
  EARLY_HINTS: 103, // Used to return some response headers before final HTTP message

  // Success 2xx
  OK: 200, // Successful request
  CREATED: 201, // Resource created Successfully on the server
  ACCEPTED: 202, // Request has been accepted but not yet acted upon
  NON_AUTHORITATIVE_INFORMATION: 203, // Metainformation is from a local or third-party copy
  NO_CONTENT: 204, // Request processed Successfully but no content returned
  RESET_CONTENT: 205, // No new data requested after a form submission
  PARTIAL_CONTENT: 206, // Partial response as requested by the client
  MULTI_STATUS: 207, // Multiple resources were being fetched and the server response is a DAV response
  ALREADY_REPORTED: 208, // Indicates that the members of a WebDAV binding have already been enumerated
  IM_USED: 226, // The server has fulfilled a GET request for the resource, and the response is a representation of the result

  // Redirection 3xx
  MULTIPLE_CHOICES: 300, // Indicates multiple options for the resource that the client may follow
  MOVED_PERMANENTLY: 301, // Resource has been permanently moved to a different URI
  FOUND: 302, // Resource temporarily moved to a different URI
  SEE_OTHER: 303, // Response to the request can be found under a different URI
  NOT_MODIFIED: 304, // The client can retrieve a cached version of the resource
  USE_PROXY: 305, // Request should be made through a proxy
  SWITCH_PROXY: 306, // Deprecated and not used
  TEMPORARY_REDIRECT: 307, // Resource temporarily moved, but future requests should still use the original URI
  PERMANENT_REDIRECT: 308, // Indicates that the requested information has been definitively moved to the URI given

  // Client Errors 4xx
  BAD_REQUEST: 400, // The server cannot process the request due to a client error
  UNAUTHORIZED: 401, // Authentication is required and has failed or not yet been provided
  PAYMENT_REQUIRED: 402, // Reserved for future use
  FORBIDDEN: 403, // Server understood the request, but refuses to authorize it
  NOT_FOUND: 404, // The requested resource could not be found
  METHOD_NOT_ALLOWED: 405, // The request method is not supported for the requested resource
  NOT_ACCEPTABLE: 406, // The server cannot produce a response matching the list of acceptable values
  PROXY_AUTHENTICATION_REQUIRED: 407, // Proxy authentication is required to access the resource
  REQUEST_TIMEOUT: 408, // Server timed out waiting for the request
  CONFLICT: 409, // Indicates a conflict in the request, such as an edit conflict
  GONE: 410, // The resource is no longer available
  LENGTH_REQUIRED: 411, // The request did not specify the length of its content
  PRECONDITION_FAILED: 412, // One or more conditions set in the request header fields evaluated to false
  PAYLOAD_TOO_LARGE: 413, // The request is larger than the server is willing or able to process
  URI_TOO_LONG: 414, // The URI provided was too long for the server to process
  UNSUPPORTED_MEDIA_TYPE: 415, // The server does not support the media type of the request
  RANGE_NOT_SATISFIABLE: 416, // The range specified in the Range header is not valid
  EXPECTATION_FAILED: 417, // The server cannot meet the requirements of the Expect request-header field
  IM_A_TEAPOT: 418, // I'm a teapot (an April Fools' joke by IETF)
  MISDIRECTED_REQUEST: 421, // The request was directed at a server that is not able to produce a response
  UNPROCESSABLE_ENTITY: 422, // The request was well-formed but was unable to be followed due to semantic errors
  LOCKED: 423, // The resource is locked and cannot be accessed
  FAILED_DEPENDENCY: 424, // The request failed due to failure of a previous request
  TOO_EARLY: 425, // Indicates that the server is unwilling to risk processing a request
  UPGRADE_REQUIRED: 426, // The client should switch to a different protocol
  PRECONDITION_REQUIRED: 428, // The origin server requires the request to be conditional
  TOO_MANY_REQUESTS: 429, // The user has sent too many requests in a given amount of time
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // The server is unwilling to process the request because its header fields are too large
  UNAVAILABLE_FOR_LEGAL_REASONS: 451, // The request is denied due to legal reasons

  // Server Errors 5xx
  INTERNAL_SERVER_ERROR: 500, // An unexpected condition was encountered and no more specific message is suitable
  NOT_IMPLEMENTED: 501, // The server does not have the functionality required to fulfill the request
  BAD_GATEWAY: 502, // The server, while acting as a gateway or proxy, received an invalid response from the upstream server
  SERVICE_UNAVAILABLE: 503, // The server is currently unable to handle the request due to a temporary overload
  GATEWAY_TIMEOUT: 504, // The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server
  HTTP_VERSION_NOT_SUPPORTED: 505, // The server does not support the HTTP protocol version used in the request
  VARIANT_ALSO_NEGOTIATES: 506, // Transparent content negotiation for the request results in a circular reference
  INSUFFICIENT_STORAGE: 507, // The server is unable to store the representation needed to complete the request
  LOOP_DETECTED: 508, // The server detected an infinite loop while processing the request
  NOT_EXTENDED: 510, // Further extensions to the request are required for the server to fulfill it
  NETWORK_AUTHENTICATION_REQUIRED: 511, // The client needs to authenticate to gain network access
};

export { HttpStatusCode };
