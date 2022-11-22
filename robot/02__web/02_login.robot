*** Settings ***
Documentation    Login, autologin and profile page tests
Library    Browser    auto_closing_level=Suite
Resource    ../resources.robot

*** Variables ***
${USERNAME}
${PASSWORD}
${FIRST_NAME}
${LAST_NAME}
${EMAIL}

*** Test Cases ***
Login with registered user
    New Context
    New Page    ${FRONTEND_URL}
    
    Type Text    input#userNameInput    ${USERNAME}
    Type Text    input#passwordInput    ${PASSWORD}

    Click    button#signInButton

Navigate to profile page
    Get Text    xpath=(//a[@id='nav-route-profile'])[1]    ==    PROFIILI
    Click    xpath=(//a[@id='nav-route-profile'])[1]

Validate that the correct user is logged in
    Get Text    p#userNameValue    ==    ${USERNAME}
    Get Text    p#userEmailValue    ==    ${EMAIL}
    Get Text    p#userFirstNameValue    ==    ${FIRST_NAME}
    Get Text    p#userLastNameValue    ==    ${LAST_NAME}

Load new page and assert auto login
    [Documentation]    Previous steps combined without login on a new window, expected to get logged in automatically
    New Page    ${FRONTEND_URL}

    Wait Until Network Is Idle

    Take Screenshot
    Get Url    ==    ${FRONTEND_URL}

    Click    xpath=(//a[@id='nav-route-profile'])[1]

    Get Text    p#userNameValue    ==    ${USERNAME}
    Get Text    p#userEmailValue    ==    ${EMAIL}
    Get Text    p#userFirstNameValue    ==    ${FIRST_NAME}
    Get Text    p#userLastNameValue    ==    ${LAST_NAME}