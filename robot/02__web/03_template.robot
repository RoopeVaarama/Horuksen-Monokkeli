*** Settings ***
Documentation    Template creation
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

Click new template button and give title
    Click    css=#newTemplateBtn

    Fill Text    //input[@id='templateTitleInput']    TemplateNimi
    Get Text    //input[@id='templateTitleInput']    ==    TemplateNimi


Add first keyword (total)
    Fill Text    css=#templateRowCollapse1 .templateRowKeyInput input    Total
    Get Text    css=#templateRowCollapse1 .templateRowKeyInput input    ==    Total

Add new row    
    Click    "Lisää rivi"

Add second keyword (Web Design)
    Fill Text    css=#templateRowCollapse2 .templateRowKeyInput input    Web Design
    Get Text    css=#templateRowCollapse2 .templateRowKeyInput input    ==    Web Design

Change direction to down
    Click    css=#templateRowCollapse2 .relativePositionSelect
    Click    css=#direction-below

Save template
    Click    css=button.saveBtn

## Todo: Edit template