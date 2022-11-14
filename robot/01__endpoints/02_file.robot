*** Settings ***
Resource    ../resources.robot
Library    RequestsLibrary
Library         REST    ${BACKEND_URL}files/
Library    JSONLibrary

*** Variables ***
${new_file_id}    # Just to ignore IDE errors, handled by Set Suite Variable

*** Test Cases ***

POST New file
    [Documentation]    Upload test pdf to server
    ${file_1}=  Get File For Streaming Upload  ${CURDIR}/../files/invoice.pdf
    ${file_tuple}    Evaluate    ('invoice.pdf', $file_1, 'application/pdf')
    ${files}=   Create Dictionary  file    ${file_tuple}

    ${resp}=    RequestsLibrary.POST    ${BACKEND_URL}files/upload    files=${files}
    ${json}=    Set Variable    ${resp.json()}
    ${values}=    Get Value From Json    ${json}    $._id

    ${new_file_id}=    Set Variable    ${values[0]}
    Set Suite Variable    ${new_file_id}    # Set ID to suite variable to be used later

DELETE File
    [Documentation]    Delete file previously created in this suite
    REST.DELETE    /${new_file_id}
    Integer    response status    200
    Boolean    response body    true
    [Teardown]    Output Schema