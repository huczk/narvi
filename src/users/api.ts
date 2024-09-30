import { useInfiniteQuery } from "@tanstack/react-query";
import type {
	GithubError,
	GithubListResponse,
	GithubUser,
	GithubUsersQueryParams,
} from "./api.types";

const resultsPerPage = 10;

type FetchUsersParams = { pageParam: number; params?: GithubUsersQueryParams };

const fetchUsers = async ({
	pageParam = 1,
	params,
}: FetchUsersParams): Promise<GithubListResponse<GithubUser>> => {
	const paramsString = new URLSearchParams({
		q: params?.username || "",
		per_page: String(resultsPerPage),
		page: String(pageParam),
	}).toString();

	const response = await fetch(
		`https://api.github.com/search/users${paramsString ? `?${paramsString}` : ""}`,
	);

	if (!response.ok || response.status !== 200) {
		const error = (await response.json()) as GithubError;
		throw new Error(error.message ?? "Unknown error");
	}

	const data = await response.json();

	return {
		...data,
		page: pageParam,
	};
};

export const useGithubUsers = (params?: { username?: string }) => {
	return useInfiniteQuery({
		queryKey: ["searchUsers", params],
		queryFn: ({ pageParam }) => fetchUsers({ pageParam, params }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.total_count / resultsPerPage <= lastPage.page
				? null
				: lastPage.page + 1,
		retry: 0,
		enabled: Boolean(params?.username),
	});
};
