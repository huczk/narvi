import type { InfiniteData } from "@tanstack/react-query";
import { useState } from "react";
import { type Async, makeAsync, queryToAsync } from "../helpers/async";
import { useDebounce } from "../helpers/useDebounce";
import { useGithubUsers } from "./api";
import type {
	GithubListResponse,
	GithubUser,
	GithubUsersQueryParams,
} from "./api.types";

export type UsersModelActionsMap = {
	searchByUsername: { username: string };
	fetchNextPage: never;
};

export type Actions<TPayloads extends Record<string, unknown>> = {
	[Key in keyof TPayloads]: TPayloads[Key] extends never
		? { action: Key }
		: { action: Key; payload: TPayloads[Key] };
}[keyof TPayloads];

export type UsersDispatcher = (action: Actions<UsersModelActionsMap>) => void;

export type UsersModel = {
	params: GithubUsersQueryParams;
	dispatch: UsersDispatcher;
	users: Array<GithubUser>;
	data: Async<InfiniteData<GithubListResponse<GithubUser>, unknown>, string>;
};

export const useUsersModel = (): UsersModel => {
	const [params, setState] = useState<GithubUsersQueryParams>({});
	const debouncedParams = useDebounce(params, 2000);
	const result = useGithubUsers(debouncedParams);

	const dispatch: UsersDispatcher = (action) => {
		switch (action.action) {
			case "searchByUsername":
				return setState(action.payload);
			case "fetchNextPage": {
				if (
					result.hasNextPage &&
					!result.isLoading &&
					!result.isFetching &&
					!result.isFetchingNextPage &&
					!result.error
				) {
					result.fetchNextPage();
				}
			}
		}
	};

	const data = !params.username
		? makeAsync.notFetched()
		: params !== debouncedParams
			? makeAsync.fetching()
			: queryToAsync(result);

	return {
		params,
		dispatch,
		users: result.data?.pages.flatMap((page) => page.items) ?? [],
		data,
	};
};
