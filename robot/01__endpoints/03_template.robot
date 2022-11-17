*** Settings ***
Resource    ../resources.robot
Library         REST    ${BACKEND_URL}template/
Library    JSONLibrary

*** Variables ***
${new_template_id}    # Just to ignore IDE errors, handled by Set Suite Variable
${AUTH_TOKEN}
*** Test Cases ***

Set Headers
    ${headers}=    Create Dictionary    Authorization    Bearer ${AUTH_TOKEN}
    Set Headers    ${headers}
 
POST New Template
    ${template_json} =    Load Json From File    ${CURDIR}/json/template.json
    POST    /    ${template_json}
    Expect Response Body    ${template_json}
    
    Integer    response status    201
    String    response body _id

    ${new_template_id}    Output    response body _id
    Set Suite Variable    ${new_template_id}

    [Teardown]    Output Schema

GET Created template
    ${template_json} =    Load Json From File    ${CURDIR}/json/template.json
    GET     /${new_template_id}

    # Title
    ${title} =    Get Value From Json    ${template_json}    $.title
    String    $.title    ${title[0]}

    # Term 1
    ${key1} =    Get Value From Json    ${template_json}    $.terms[0].key
    String    $.terms[0].key    ${key1[0]}
    ${dir1} =    Get Value From Json    ${template_json}    $.terms[0].direction
    Integer    $.terms[0].direction    ${dir1[0]}

    # Term 2
    ${key2} =    Get Value From Json    ${template_json}    $.terms[1].key
    String    $.terms[1].key    ${key2[0]}
    ${dir2} =    Get Value From Json    ${template_json}    $.terms[1].direction
    Integer    $.terms[1].direction    ${dir2[0]}

    [Teardown]    Output Schema

PATCH Change title and remove term
    ${template_json} =    Load Json From File    ${CURDIR}/json/template.json
    ${patched_template_json} =    Delete Object From Json    ${template_json}    $.terms[0]    # Delete first term
    ${patched_template_json} =    Update Value To Json    ${patched_template_json}    $.title    Robot test template 1    # Change title

    PATCH    /${new_template_id}    ${patched_template_json}
    Integer    response status    200

    # Title
    String    $.title    Robot test template 1    # Should equal to new title

    # Term 1
    # Should equal to previous second term (index 1)
    ${key1} =    Get Value From Json    ${template_json}    $.terms[1].key
    String    $.terms[0].key    ${key1[0]}
    ${dir1} =    Get Value From Json    ${template_json}    $.terms[1].direction
    Integer    $.terms[0].direction    ${dir1[0]}

    [Teardown]    Output Schema

DELETE Created Template
    DELETE    /${new_template_id}
    Integer    response status    200
    Boolean    response body    true
    [Teardown]    Output Schema