*** Settings ***
Documentation    File handling
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
    [Documentation]    Click navigation item with text 'TIEDOSTOT'
    Get Text    xpath=(//a[@id='nav-route-files'])[1]    ==    TIEDOSTOT
    Click    xpath=(//a[@id='nav-route-files'])[1]

