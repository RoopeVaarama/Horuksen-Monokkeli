*** Settings ***
Documentation    Login, autologin and profile page tests
Library    Browser    auto_closing_level=Suite
Resource    ../resources.robot

*** Variables ***
${USERNAME}
${PASSWORD}

*** Test Cases ***
Login with registered user
    New Context
    New Page    ${FRONTEND_URL}
    
    Type Text    input#userNameInput    ${USERNAME}
    Type Text    input#passwordInput    ${PASSWORD}

    Click    button#signInButton

Navigate to templates page
    [Documentation]    Click navigation item with text 'Templatet'
    Get Text    xpath=(//a[@id='nav-route-templates'])[1]    ==    TEMPLATET
    Click    xpath=(//a[@id='nav-route-templates'])[1]

    