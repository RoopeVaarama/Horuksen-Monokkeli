*** Settings ***
Library    Browser
Resource    ../resources.robot
*** Test Cases ***
Start Context
    New Context

Check Title
    New Page    ${FRONTEND_URL}
    Get Text    xpath=//h6[@class='MuiTypography-root MuiTypography-h6 css-d49kju']    ==    Horuksen monokkeli

Check Navigation
    New Page    ${FRONTEND_URL}
    Get Text    xpath=//a[contains(text(),'Uusi haku')]    ==    UUSI HAKU