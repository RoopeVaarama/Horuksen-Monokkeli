*** Settings ***
Documentation    Performing actual search from PDF file
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

Check that navigation exists
    [Documentation]    Check that navigation option exists.
    Get Text    xpath=(//a[@id='nav-route-files'])[1]    ==    TIEDOSTOT

Add template to search
    Click    css=#templatesPage .templateItem > ul > button

Go to file selection tab
    Click    "Valitse tiedostot"

Upload invoice.pdf
    Upload File By Selector    //input[@id='file-upload-input']    ${CURDIR}/../files/invoice.pdf
    Wait Until Network Is Idle

Select uploaded file
    Click    "Kaikki tiedostot"
    Click    "invoice.pdf"

See results
    Click    "Tarkastele tuloksia"

Check result validity
    [Documentation]    Todo: Rework this
    Get Element    "key: Total"
    Get Element    "value: $93.50"
    Get Element    "key: Web Design"
    Get Element    "value: This is a sample description..."