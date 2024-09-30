import type { UseQueryResult } from "@tanstack/react-query";

export type AsyncError<T = string> = { type: "fetch-error"; value: T };
export type AsyncFetched<T = string> = { type: "fetched"; value: T };
export type AsyncNotFetched = { type: "not-fetched" };
export type AsyncFetching = { type: "fetching" };
export type Async<TValue = unknown, TError = string> =
	| AsyncNotFetched
	| AsyncFetching
	| AsyncFetched<TValue>
	| AsyncError<TError>;

export const queryToAsync = <T>(
	query: UseQueryResult<T, Error>,
	err?: Error | null,
): Async<T> => {
	if (err) return makeAsync.error(err.message);
	if (query.isFetching) return makeAsync.fetching();
	if (query.error) return makeAsync.error(query.error.message);
	if (query.data) return makeAsync.fetched(query.data);
	return makeAsync.notFetched();
};

export const makeAsync = {
	notFetched: (): AsyncNotFetched => ({
		type: "not-fetched",
	}),
	fetching: (): AsyncFetching => ({
		type: "fetching",
	}),
	fetched: <T>(value: T): AsyncFetched<T> => ({
		type: "fetched",
		value,
	}),
	error: <TErr>(value: TErr): AsyncError<TErr> => ({
		type: "fetch-error",
		value,
	}),
};
