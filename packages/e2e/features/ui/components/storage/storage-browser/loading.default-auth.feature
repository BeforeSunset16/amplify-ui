Feature: (Default Auth) Loading spinner on Storage Browser views

  Background:
    Given I'm running the StorageBrowser example "ui/components/storage/storage-browser/default-auth" on a slow connection
  
  @react
  Scenario: Loading spinner on LocationsView
    
  @react
  Scenario: Loading spinner on LocationsView after using the Refresh control
  
  @react
  Scenario: Loading spinner on LocationDetailView
    When I type my "email" with status "CONFIRMED"
    Then I type my password
    Then I click the "Sign in" button
    Then I click the button containing "public"
    Then I see "Loading"

  @react
  Scenario: Loading spinner on LocationDetailView after using the Refresh control
    When I type my "email" with status "CONFIRMED"
    Then I type my password
    Then I click the "Sign in" button
    Then I click the button containing "public"
    Then I click the "Refresh table" button on a slow network
    Then I see "Loading"
