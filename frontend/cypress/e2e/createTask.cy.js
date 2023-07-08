describe('Logging into the system', () => {
    let userId 
    let userName 
    let userEmail 
    let todoid
  
  
    beforeEach(function () {
      // create a fabricated user from a fixture
      cy.viewport(1000, 1600);
      cy.fixture('user.json').then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          userId = response.body._id.$oid
          userName = user.firstName + ' ' + user.lastName
          userEmail = user.email
  
          cy.visit('http://localhost:3000')  
          cy.get('h1')
            .should('contain.text', 'Login')
  
          cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(userEmail)
  
        cy.get('form')
            .submit()
  
          cy.contains('div', 'title')
          .find('input[type=text]')
          cy.get('#title')
          .type('myFirstTask')
          cy.get('[type="submit"]').click()
  
          cy.get('.main > :nth-child(1)')
            .should('contain.text', 'myFirstTask')
  
          cy.get(':nth-child(1) > a > img').trigger('click')
  
        cy.get('.popup-inner').should('be.visible');

        cy.get('h1 > .editable').should('contain.text', 'myFirstTask')   
        })
      })
    })
  
    // R8UC1: create a ToDo item
    it("When a user enters text into textfield and presses add, new todo should be created", () => {
      cy.get('.inline-form > [type="text"]').click()
      cy.get('.inline-form > [type="text"]').clear()
      cy.get('.inline-form > [type="text"]').type('myFirstTodoDescription')
  
      cy.get('.inline-form > [type="submit"]').should('be.enabled')
    })
    
    it("If the text field is left empty then the todo should not be added when the user clicks add & textfield should get red border", () => {
      cy.get('.inline-form > [type="text"]').click()
      cy.get('.inline-form > [type="text"]').clear()
      
      cy.get('.inline-form > [type="submit"]').should('be.disabled')
    })
  
    it("Add button should be disabled when description is empty", () => {
        cy.get('.inline-form > [type="text"]').click()
        cy.get('.inline-form > [type="text"]').clear()
        
        cy.get('.inline-form > [type="submit"]').should('be.disabled')
      })
  
    it("Add subtask to the bottom when description is filled and add button is enabled", () => {
      cy.get('.inline-form > [type="text"]').click()
      cy.get('.inline-form > [type="text"]').clear()
  
      cy.get('.inline-form > [type="text"]').type('myFirstTodoDescription')
      cy.get('.inline-form > [type="submit"]').should('be.enabled')
      cy.get('.inline-form > [type="submit"]').click()
  
      cy.get('.inline-form > [type="text"]').type('mySecondTodoDescription')
      cy.get('.inline-form > [type="submit"]').should('be.enabled')
      cy.get('.inline-form > [type="submit"]').click()
      
      cy.get('.todo-list > :nth-child(3)').should('contain.text', 'mySecondTodoDescription')
      cy.get('.todo-list > :nth-child(3)').should('contain.text', 'mySecondTodoDescription')
      
    })

    beforeEach(function () {
        cy.visit('http://localhost:3000')

        cy.get('h1')
            .should('contain.text', 'Login')

        cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(userEmail)

        cy.get('form')
            .submit()

        cy.contains('div', 'title')
        .find('input[type=text]')
        cy.get('#title')
        .type('myFirstTask')
        cy.get('[type="submit"]').click()

        cy.get('.main > :nth-child(1)')
            .should('contain.text', 'myFirstTask')

        cy.get(':nth-child(1) > a > img').trigger('click')
        
        cy.get('.inline-form > [type="text"]').click()
        cy.get('.inline-form > [type="text"]').clear()

        cy.get('.inline-form > [type="text"]').type('myFirstTodoDescription')
        cy.get('.inline-form > [type="submit"]').should('be.enabled')
        cy.get('.inline-form > [type="submit"]').click()
        cy.wait(3000)
        cy.request({
            method: 'GET',
            url: `http://localhost:5000/tasks/ofuser/${userId}`
        }).then((response) => {
            cy.log(response)
            todoid = response.body[0].todos[0]._id.$oid
        })
        })
    })
  
    // R8UC2: marking todo items as done
    it("Clicking icon before the todo item should mark the todo item as done with line threw", () => {
        cy.get('.todo-list > :nth-child(2) .checker').click()
        .should('have.class', 'checked')
        cy.get('.todo-list > :nth-child(2) .editable')
        .should('have.css', 'text-decoration', 'line-through solid rgb(49, 46, 46)')
    })
  
    it("Clicking the icon again should make todo unDone",() =>{
        console.log(todoid)
        cy.fixture("todo.json").then((todo) => {
            cy.request({
                method: 'PUT',
                url: `http://localhost:5000/todos/byid/${todoid}`,
                form: true,
                body: todo
              }).then((response) => {
                cy.log(response)
              })
          })
          cy.get('.todo-list > :nth-child(1) .checker').click()
          cy.get('.todo-list > :nth-child(1) .editable')
          .should('have.css', 'text-decoration', 'line-through solid rgb(49, 46, 46)')
          cy.get('.todo-list > :nth-child(1) .checker')
          .should('have.class', 'checked')
          .click()
          .should('not.have.css', 'text-decoration', 'line-through solid rgb(49, 46, 46)')
    })
  
    
    // R8UC3: deleting todo items
    it('Clicking on the "x" beside the todo item should remove it from the list', ()=>{
        cy.get('ul.todo-list')
        .should('contain.text', 'myFirstTodoDescription')
        cy.get(':nth-child(2) > .remover').click()
        cy.get('ul.todo-list')
        .should('not.contain.text', 'myFirstTodoDescription')
    })

    afterEach(function () {
        // clean up by deleting the user from the database 

        cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${userId}`
        }).then((response) => {
        cy.log(response.body)
        })  
    })
