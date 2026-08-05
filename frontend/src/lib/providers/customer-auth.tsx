"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCustomerSession, logoutCustomer } from "@/lib/api/customer";
import { customerKeys } from "@/lib/queries/customer";
import type { CustomerSession, CustomerUser } from "@/types";

interface CustomerAuthValue {
	user: CustomerUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	refresh: () => Promise<void>;
	/** Apply a known user without a round-trip (after login/signup). */
	setUser: (user: CustomerUser | null) => void;
	signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	const { data, isPending } = useQuery({
		queryKey: customerKeys.session(),
		queryFn: getCustomerSession,
		staleTime: Infinity,
		retry: false,
	});

	const user = data?.authenticated ? data.user : null;

	const setUser = useCallback(
		(next: CustomerUser | null) => {
			const session: CustomerSession = next
				? { authenticated: true, user: next }
				: { authenticated: false, user: null };
			queryClient.setQueryData(customerKeys.session(), session);
		},
		[queryClient],
	);

	const refresh = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: customerKeys.session() });
	}, [queryClient]);

	const signOut = useCallback(async () => {
		try {
			await logoutCustomer();
		} finally {
			setUser(null);
			queryClient.removeQueries({ queryKey: customerKeys.all });
		}
	}, [setUser, queryClient]);

	return (
		<CustomerAuthContext.Provider
			value={{
				user,
				isLoading: isPending,
				isAuthenticated: !!user,
				refresh,
				setUser,
				signOut,
			}}
		>
			{children}
		</CustomerAuthContext.Provider>
	);
}

export function useCustomerAuth(): CustomerAuthValue {
	const ctx = useContext(CustomerAuthContext);
	if (!ctx) {
		throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
	}
	return ctx;
}
