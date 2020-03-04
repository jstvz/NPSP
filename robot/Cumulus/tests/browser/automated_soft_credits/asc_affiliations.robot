*** Settings ***

Resource        robot/Cumulus/resources/NPSP.robot
Library         cumulusci.robotframework.PageObjects
...             robot/Cumulus/resources/ContactPageObject.py
...             robot/Cumulus/resources/OpportunityPageObject.py
...             robot/Cumulus/resources/OpportunityContactRolePageObject.py
...             robot/Cumulus/resources/NPSPSettingsPageObject.py
Suite Setup     Open Test Browser
Suite Teardown  Delete Records and Close Browser

 
*** Test Cases ***    
Create ASC for Affiliated Contact
    [Documentation]            Create a contact and Org Account via API.Open contact and create an affiliation to the org with
    ...                        Opp contact role as Soft Credit. Create an opportunity amount as 500, stage as closed won, close date as today.
    ...                        Verify contact shows under contact role with Role as soft credit. 
    ...                        After running donations batch job verify contact gets soft credits
   
    [tags]                     feature:Automated Soft Credits        W-039819
    &{account} =  API Create Organization Account   
    &{contact} =  API Create Contact    Email=skristem@robot.com 
    Go To Page                              Details                              Contact                                
    ...                                     object_id=&{contact}[Id]
    Select Tab                              Related
    Click Related List Button               Organization Affiliations            New
    Wait For Modal                          New                                  Affiliation
    Populate Lookup Field                   Organization                         &{account}[Name]
    Select Value From Dropdown              Related Opportunity Contact Role     Soft Credit
    Click Modal Button                      Save
    Wait Until Modal Is Closed
    
    &{opportunity} =  API Create Opportunity    &{account}[Id]    Donation    Name=&{account}[Name] $500 donation    Amount=500    
    Go To Page                              Details                              Opportunity                                
    ...                                     object_id=&{opportunity}[Id]
    Select Tab                              Related
    Select Relatedlist                      Contact Roles
    Wait For Page Object                    Custom    OpportunityContactRole
    Verify Related List Field Values
    ...                     &{contact}[FirstName] &{contact}[LastName]=Soft Credit
    Go To Page                              Details                              Contact                                
    ...                                     object_id=&{contact}[Id]
    Select Tab                              Related
    Check Record Related Item               Opportunities    &{opportunity}[Name]
    Run Donations Batch Process
    Go To Page                              Details                              Contact                                
    ...                                     object_id=&{Contact}[Id]
    Navigate To And Validate Field Value    Soft Credit This Year    contains    $500.00    section=Soft Credit Total
    Navigate To And Validate Field Value    Soft Credit Total        contains    $500.00    section=Soft Credit Total
