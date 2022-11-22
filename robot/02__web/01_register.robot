*** Settings ***
Documentation    New user registration, login and register page translations
Library    Browser    auto_closing_level=Suite
Resource    ../resources.robot

*** Variables ***
${USERNAME}
${PASSWORD}=    asdasd123123
${FIRST_NAME}=    Testi
${LAST_NAME}=    Testinen
${EMAIL}=    testi@testi.fi

*** Test Cases ***
Set Variables
    [Documentation]    Set global variables to be used by browser FW tests
    ${epoch}    Get Time    
    Set Global Variable    ${USERNAME}    user_${epoch}
    Set Global Variable    ${PASSWORD}
    Set Global Variable    ${FIRST_NAME}
    Set Global Variable    ${LAST_NAME}
    Set Global Variable    ${EMAIL}

Start Context and check title
    [Documentation]    First test to check that the site can be opened
    New Context
    New Page    ${FRONTEND_URL}
    Get Text    xpath=//h6[@id='appTitle']    ==    Horuksen monokkeli

Change language to English
    [Documentation]    Open dropdown menu on the right corner and change language to English, assert that the login form is English
    Click    xpath=//button[@id='dropdownMenuButton']    # Open dropdown menu
    Click    "English"
    Get Text    "Username"
    Get Text    "Password"
    Get Text    xpath=//button[@id='signInButton']    ==    SIGN IN

Enter register form
    [Documentation]    Click element with text "Register"
    Click    "Register"
    
Assert register form to be in English
    [Documentation]    Look for required input fields by text in English
    Get Text    "Username"
    Get Text    "First name"
    Get Text    "Last name"
    Get Text    "Email"
    Get Text    "Password"
    Get Text    "Repeat password"
    Get Text    xpath=(//button[@type='submit'])[1]    ==    REGISTER
    Get Text    "Sign in"

Change language back to Finnish
    [Documentation]    Change language to Finnish from dropdown menu on the top right corner
    Click    xpath=//button[@id='dropdownMenuButton']   # Open dropdown menu 
    Click    "Suomi"

Input user information
    [Documentation]    Fill in user information
    Click    "Rekisteröidy"

    Mouse Move Relative To    "Käyttäjätunnus"
    Mouse Button    click
    Keyboard Input    type    ${USERNAME}
    Get Text    //input[@id='userNameInput']    ==    ${USERNAME}

    Mouse Move Relative To    "Etunimi"
    Mouse Button    click
    Keyboard Input    type    ${FIRST_NAME}
    Get Text    (//input[@name='firstName'])[1]    ==    ${FIRST_NAME}

    Mouse Move Relative To    "Sukunimi"
    Mouse Button    click
    Keyboard Input    type    ${LAST_NAME}
    Get Text    (//input[@name='lastName'])[1]    ==    ${LAST_NAME}

    Mouse Move Relative To    "Sähköposti"
    Mouse Button    click
    Keyboard Input    type    ${EMAIL}
    Get Text    (//input[@name='email'])[1]    ==    ${EMAIL}

    Mouse Move Relative To    "Salasana"
    Mouse Button    click
    Keyboard Input    type    ${PASSWORD}

    Mouse Move Relative To    "Salasana uudelleen"
    Mouse Button    click
    Keyboard Input    type    ${PASSWORD}

Register user
    [Documentation]    Click button with text 'Rekisteröidy'
    Click    form#registerForm > button[type='Submit']
    Get Text    "Rekisteröityminen onnistui"

Login user
    [Documentation]    Input user login details and click 'Kirjaudu sisään'

    Mouse Move Relative To    "Käyttäjätunnus"
    Mouse Button    click
    Keyboard Input    type    ${USERNAME}

    Mouse Move Relative To    "Salasana"
    Mouse Button    click
    Keyboard Input    type    ${PASSWORD}

    Click    "Kirjaudu sisään"

    Get Text    "Kirjauduttu sisään"
    Get Text    xpath=(//a[@id='nav-route-newSearch'])[1]    ==    UUSI HAKU