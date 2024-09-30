import type { Async } from "../helpers/async";
import { useInfiniteListObserver } from "../helpers/useInfiniteListObserver";
import type { GithubUser, GithubUsersQueryParams } from "./api.types";
import { type UsersDispatcher, useUsersModel } from "./users.model";

// here should be map from model data to desired component list data
const toUserList = (users: Array<GithubUser>) =>
	users.map((user) => ({
		id: user.id,
		login: user.login,
		avatar_url: user.avatar_url,
	}));

export type UsersViewModel = {
	type: Async["type"];
	value: {
		params: GithubUsersQueryParams;
		dispatch: UsersDispatcher;
		users: Array<{ id: number; login: string; avatar_url: string }>;
		error: string | undefined;
		lastListElementRef: ReturnType<typeof useInfiniteListObserver>;
	};
};

export const useUsersViewModel = (): UsersViewModel => {
	const model = useUsersModel();

	const lastListElementRef = useInfiniteListObserver(() =>
		model.dispatch({ action: "fetchNextPage" }),
	);

	return {
		type: model.data.type,
		value: {
			params: model.params,
			dispatch: model.dispatch,
			users: toUserList(model.users),
			error: model.data.type === "fetch-error" ? model.data.value : undefined,
			lastListElementRef,
		},
	};
};
