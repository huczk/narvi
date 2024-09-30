import { Avatar, Box, TextField, Typography } from "@mui/material";
import { useUsersViewModel } from "./users.view_model";

export const UsersList = () => {
	const viewModel = useUsersViewModel();

	return (
		<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
			<TextField
				id="outlined-basic"
				label="Search user"
				variant="outlined"
				value={viewModel.value.params.username ?? ""}
				onChange={(e) =>
					viewModel.value.dispatch({
						action: "searchByUsername",
						payload: { username: e.target.value },
					})
				}
			/>

			{viewModel.value.users.length > 0 && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						overflowY: "auto",
						maxHeight: 200,
						border: "1px solid gray",
						p: 1,
					}}
				>
					{viewModel.value.users.map((user) => (
						<Box sx={{ display: "flex", alignItems: "center" }} key={user.id}>
							<Avatar sx={{ bgcolor: "blue" }} src={user.avatar_url} />
							<Typography variant="body2" sx={{ ml: 2 }}>
								{user.login}
							</Typography>
						</Box>
					))}
					<div ref={viewModel.value.lastListElementRef} />
				</Box>
			)}

			{viewModel.type === "fetch-error" && (
				<div style={{ color: "red" }}>{viewModel.value.error}</div>
			)}
			{viewModel.type === "fetching" && <div>Loading...</div>}
			{viewModel.type === "fetched" && viewModel.value.users.length === 0 && (
				<div>No results</div>
			)}
		</Box>
	);
};
