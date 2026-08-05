"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAdminSession, logoutAdmin } from "@/lib/api/admin";
import { adminKeys } from "@/lib/queries/admin";
import type { AdminIdentity, AdminSession } from "@/types";

interface AdminAuthValue {
	admin: AdminIdentity | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	/** True if the current admin holds `permission` (superadmin holds all). */
	hasPermission: (permission: string) => boolean;
	/** Re-read the session cookie (e.g. right after login). */
	refresh: () => Promise<void>;
	/** Apply a known identity without a round-trip (used by the login flow). */
	setAdmin: (admin: AdminIdentity | null) => void;
	signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	const { data, isPending } = useQuery({
		queryKey: adminKeys.session(),
		queryFn: getAdminSession,
		staleTime: Infinity,
		retry: false,
	});

	const admin = data?.authenticated ? data.admin : null;

	const hasPermission = useCallback(
		(permission: string) => {
			if (!admin) return false;
			if (admin.role === "superadmin") return true;
			return (admin.permissions ?? []).includes(permission);
		},
		[admin],
	);

	const setAdmin = useCallback(
		(identity: AdminIdentity | null) => {
			const next: AdminSession = identity
				? { authenticated: true, admin: identity }
				: { authenticated: false, admin: null };
			queryClient.setQueryData(adminKeys.session(), next);
		},
		[queryClient],
	);

	const refresh = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: adminKeys.session() });
	}, [queryClient]);

	const signOut = useCallback(async () => {
		try {
			await logoutAdmin();
		} finally {
			setAdmin(null);
		}
	}, [setAdmin]);

	return (
		<AdminAuthContext.Provider
			value={{
				admin,
				isLoading: isPending,
				isAuthenticated: !!admin,
				hasPermission,
				refresh,
				setAdmin,
				signOut,
			}}
		>
			{children}
		</AdminAuthContext.Provider>
	);
}

export function useAdminAuth(): AdminAuthValue {
	const ctx = useContext(AdminAuthContext);
	if (!ctx) {
		throw new Error("useAdminAuth must be used within AdminAuthProvider");
	}
	return ctx;
}
