import { render } from "@testing-library/react";
import { type UsersViewModel, useUsersViewModel } from "./users.view_model";
import { UsersList } from "./users_list";

const emptyValue: UsersViewModel = {
	type: "not-fetched",
	value: {
		params: {},
		dispatch: vi.fn(),
		users: [],
		error: undefined,
		lastListElementRef: vi.fn(),
	},
};

vi.mock("./users.view_model");

describe("UsersList", () => {
	test("should render loading message", () => {
		vi.mocked(useUsersViewModel).mockReturnValue({
			type: "fetching",
			value: emptyValue.value,
		});

		const { getByText } = render(<UsersList />);
		expect(getByText("Loading...")).toBeVisible();
	});

	test("should render error message", () => {
		vi.mocked(useUsersViewModel).mockReturnValue({
			type: "fetch-error",
			value: {
				...emptyValue.value,
				error: "Custom error",
			},
		});

		const { getByText } = render(<UsersList />);
		expect(getByText("Custom error")).toBeVisible();
	});

	test("should render users list", () => {
		vi.mocked(useUsersViewModel).mockReturnValue({
			type: "fetched",
			value: {
				...emptyValue.value,
				users: [{ id: 1, login: "Super user", avatar_url: "test.link.com" }],
			},
		});
		const { getByText } = render(<UsersList />);
		expect(getByText("Super user")).toBeVisible();
	});
});
