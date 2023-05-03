// **R8UC1: Creating a to-do item**
describe("R8UC1: create a ToDo item", () => {
	describe("User should be logged in", () => {
		before(function () {
			// create a fabricated user from a fixture
			cy.visit("localhost:3000");
			cy.fixture("user.json").then(
				(user) => {
					cy.request({
						method: "POST",
						url: "http://localhost:5000/users/create",
						form: true,
						body: user,
					}).then((response) => {
						this.uid =
							response.body._id.$oid;
					});
				}
			);
		});

		beforeEach(() => {
			cy.visit("localhost:3000");
			cy.contains("div", "Email Address")
				.find("input[type=text]")
				.type("user4@gmail.com");
			cy.get("form").submit();
		});

		it("User should have atleast one task", () => {
			cy.fixture("task.json").then(
				(task) => {
					cy.get("#title").type(
						task.title
					);
					cy.get("#url").type(task.url);
				}
			);
			// press the button to add the task
			cy.get("input").last().click();

			cy.fixture("task.json").then(
				(task) => {
					cy.get(
						".title-overlay"
					).contains(task.title);
				}
			);

			cy.get(".container-element > a")
				?.first()
				.click();
		});

		it("TC1: When a user enters text into textfield and presses add, new todo should be created", () => {
			cy.get(".container-element > a")
				.first()
				.click();
			cy.get(".inline-form")
				.find("input[type=text]")
				.type("Hello world", {
					force: true,
				});

			cy.get(".inline-form")
				.find("input[type=submit]")
				.click({ force: true });

			cy.get(
				".todo-list > :nth-child(2) > .editable"
			).contains("Hello world");
		});

		it("TC2: If the text field is left empty then the todo should not be added when the user clicks add & textfield should get red border", () => {
			cy.get(".container-element > a")
				.first()
				.click();
			cy.get(".inline-form")
				.find("input[type=submit]")
				.click({ force: true });

			cy.get(".inline-form")
				.find("input[type=text]")
				.should("have.class", "error");
		});

		it("logout", () => {
			cy.get(
				".navbar>.navbar-nav>.nav-item"
			).click();
			cy.get(".menu-item").click();
			cy.get(
				".navbar>.navbar-nav>.nav-item"
			).click();
		});
	});
});

describe("R8UC2: marking todo items as done", () => {
	beforeEach(() => {
		cy.visit("localhost:3000");
		cy.contains("div", "Email Address")
			.find("input[type=text]")
			.type("user4@gmail.com");
		cy.get("form").submit();
		cy.get(".title-overlay")?.first().click();
	});

	it("TC1: Clicking icon before the todo item should mark the todo item as done with line threw", () => {
		cy.get(".todo-list")
			.first()
			.find(".todo-item")
			.find(".checker")
			.dblclick();

		// the .checker should now also have a secondary class of checked
		cy.get(".todo-list")
			.get(".todo-item")
			.first()
			.find(".checker")
			.should("have.class", "checked");
	});

	it("TC2: Clicking the icon again should make todo unDone", () => {
		cy.get(".todo-list")
			.get(".todo-item")
			.first()
			.find(".checker")
			.dblclick();

		// the .checker should now also have a secondary class of checked
		cy.get(".todo-list")
			.get(".todo-item")
			.first()
			.find(".checker")
			.should("have.class", "unchecked");
	});
	it("logout", () => {
		cy.get(".close-btn").click({
			force: true,
		});
		cy.get(
			".navbar>.navbar-nav>.nav-item"
		).click();
		cy.get(".menu-item").click();
		cy.get(
			".navbar>.navbar-nav>.nav-item"
		).click();
	});
});

describe("R8UC3: deleting todo items", () => {
	beforeEach(() => {
		cy.visit("localhost:3000");
		cy.contains("div", "Email Address")
			.find("input[type=text]")
			.type("user4@gmail.com");
		cy.get("form").submit();
		cy.get(".title-overlay")?.first().click();
	});

	it('TC1: Clicking on the "x" beside the todo item should remove it from the list', () => {
		cy.get(
			".todo-list > :nth-child(2) > .remover"
		).click();

		// no elements with hello world should be found
		cy.get(".todo-list")
			.get(".todo-item")
			.contains("Hello world")
			.should("not.exist");
	});
});
