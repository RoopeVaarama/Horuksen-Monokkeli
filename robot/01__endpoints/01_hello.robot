*** Settings ***
Resource    ../resources.robot
Library         REST    ${BACKEND_URL}

*** Test Cases ***
GET Hello World endpoint
    GET    /
    Output Schema    response body
    String    response body    Hello World!
    [Teardown]    Output Schema