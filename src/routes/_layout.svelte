<slot></slot>

<style global>
	@import "../styles/global.css";

	main {
		@apply flex flex-col h-screen;
	}

	main > header {
		@apply flex-grow;
	}

	main > footer {
		@apply flex flex-grow flex-col justify-end;
	}
</style>