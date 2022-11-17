*** Settings ***
Library    Browser
Resource    ../resources.robot
*** Test Cases ***
Start Context
    New Context

Check Title
    New Page    ${FRONTEND_URL}
    Get Text    xpath=//h6[@id='appTitle']    ==    Horuksen monokkeli

Check Navigation
    New Page    ${FRONTEND_URL}
    Get Text    xpath=(//a[@id='nav-route-newSearch'])[1]    ==    UUSI HAKU