describe("R8UC1: create a ToDo item", () => {
	let uid;

	before(() => {
		// Create a user
		cy.fixture("user.json").then((user) => {
			cy.request(
				"POST",
				"http://localhost:5000/users/create",
				user
			).then((response) => {
				uid = response.body._id.$oid;
			});
		});
	});

	beforeEach(() => {
		// Log in the user
		cy.visit("localhost:3000");
		cy.contains("div", "Email Address")
			.find("input[type=text]")
			.type("user4@gmail.com");
		cy.get("form").submit();
	});

	it("User should have at least one task", () => {
		// Verify that the user has a task
		cy.request(
			`http://localhost:5000/users/${uid}/tasks`
		).then((response) => {
			expect(
				response.body.length
			).to.be.greaterThan(0);
		});
	});

	it("TC1: When a user enters text into the text field and presses add, a new todo should be created", () => {
		cy.get(".container-element > a")
			.first()
			.click();
		cy.get(".inline-form")
			.find("input[type=text]")
			.type("Hello world", { force: true });

		cy.get(".inline-form")
			.find("input[type=submit]")
			.click({ force: true });

		cy.get(
			".todo-list > :nth-child(2) > .editable"
		).contains("Hello world");
	});

	it("TC2: If the text field is left empty, the todo should not be added when the user clicks add, and the text field should get a red border", () => {
		cy.get(".container-element > a")
			.first()
			.click();

		// Do not enter any text in the input field

		cy.get(".inline-form")
			.find("input[type=submit]")
			.click({ force: true });

		cy.get(".inline-form")
			.find("input[type=text]")
			.should("have.class", "error");
	});

	afterEach(() => {
		// Clean up the user and tasks from the database after each test
		cy.request(
			"DELETE",
			`http://localhost:5000/users/${uid}`
		);
	});
});

describe("R8UC2: marking todo items as done", () => {
	let uid;

	before(() => {
		// Create a user
		cy.fixture("user.json").then((user) => {
			cy.request(
				"POST",
				"http://localhost:5000/users/create",
				user
			).then((response) => {
				uid = response.body._id.$oid;

				// Create a task for the user
				cy.fixture("task.json").then(
					(task) => {
						cy.request(
							"POST",
							`http://localhost:5000/users/${uid}/tasks`,
							task
						);
					}
				);
			});
		});
	});

	beforeEach(() => {
		// Log in the user
		cy.visit("localhost:3000");
		cy.contains("div", "Email Address")
			.find("input[type=text]")
			.type("user4@gmail.com");
		cy.get("form").submit();
	});

	it("TC1: Clicking icon before the todo item should mark the todo item as done with line through", () => {
		cy.get(".todo-list")
			.first()
			.find(".todo-item")
			.find(".checker")
			.click();

		cy.get(".todo-list")
			.get(".todo-item")
			.first()
			.find(".checker")
			.should("have.class", "checked");
	});

	it("TC2: Clicking the icon again should make todo undone", () => {
		cy.get(".todo-list")
			.get(".todo-item")
			.first()
			.find(".checker")
			.click();

		cy.get(".todo-list")
			.get(".todo-item")
			.first()
			.find(".checker")
			.should("not.have.class", "checked");
	});

	afterEach(() => {
		// Clean up the user and tasks from the database after each test
		cy.request(
			"DELETE",
			`http://localhost:5000/users/${uid}`
		);
	});
});

describe("R8UC3: deleting todo items", () => {
	let uid;

	before(() => {
		// Create a user
		cy.fixture("user.json").then((user) => {
			cy.request(
				"POST",
				"http://localhost:5000/users/create",
				user
			).then((response) => {
				uid = response.body._id.$oid;

				// Create a task for the user
				cy.fixture("task.json").then(
					(task) => {
						cy.request(
							"POST",
							`http://localhost:5000/users/${uid}/tasks`,
							task
						);
					}
				);
			});
		});
	});

	beforeEach(() => {
		// Log in the user
		cy.visit("localhost:3000");
		cy.contains("div", "Email Address")
			.find("input[type=text]")
			.type("user4@gmail.com");
		cy.get("form").submit();
	});

	it('TC1: Clicking on the "x" beside the todo item should remove it from the list', () => {
		cy.get(
			".todo-list > :nth-child(2) > .remover"
		).click();

		cy.get(".todo-list")
			.get(".todo-item")
			.contains("Hello world")
			.should("not.exist");
	});

	afterEach(() => {
		// Clean up the user and tasks from the database after each test
		cy.request(
			"DELETE",
			`http://localhost:5000/users/${uid}`
		);
	});
});
