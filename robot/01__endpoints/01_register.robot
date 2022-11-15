*** Settings ***
Resource    ../resources.robot
Library         REST    ${BACKEND_URL}
Library    JSONLibrary

*** Variables ***
${user_json}
${AUTH_TOKEN}
${USERNAME}
${PASSWORD}

*** Test Cases ***
Set Variables
    ${user_json}=    Load Json From File    ${CURDIR}/json/user.json
    Set Suite Variable    ${user_json}

    ${USERNAME}=    Get Value From Json    ${user_json}    $.username
    ${USERNAME}=    Set Variable    ${USERNAME[0]}
    ${PASSWORD}=    Get Value From Json    ${user_json}    $.password
    ${PASSWORD}=    Set Variable    ${PASSWORD[0]}

    Set Global Variable    ${USERNAME}
    Set Global Variable    ${PASSWORD}

POST Register new user
    POST    /user    ${user_json}
    Integer    response status    201
    String    response body username    ${USERNAME}
    [Teardown]    Output Schema

POST Login user
    ${login_body}=    Create Dictionary    username    ${USERNAME}    password    ${PASSWORD}
    POST    /auth/login    ${login_body}
    Integer    response status    201

    ${AUTH_TOKEN}    Output    response body token
    Set Global Variable    ${AUTH_TOKEN}
    ${headers}=    Create Dictionary    Authorization    Bearer ${AUTH_TOKEN}
    Set Headers    ${headers}

    [Teardown]    Output Schema

GET Hello World endpoint
    GET    /
    Output Schema    response body
    String    response body    Hello World!
    [Teardown]    Output Schema