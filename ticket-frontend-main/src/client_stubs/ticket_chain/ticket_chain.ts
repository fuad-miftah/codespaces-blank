// Generated by typescript generator


import { Operation } from "postchain-client";
import { QueryObject } from "postchain-client";

export enum TicketState {
	PENDING,
	SUCCESS,
	FAILURE
}

export enum TicketType {
	CREATE_CONTAINER
}

export type CreateContainerTicketData = {
	ticket_id: number;
	type: TicketType;
	state: TicketState;
	error_message: string;
	container_name: string;
};

export type LeaseData = {
	container_name: string;
	container_units: number;
	extra_storage_gib: number;
	expire_time_millis: number;
	expired: boolean;
	auto_renew: boolean;
};

export type GetChrAssetReturnType = {
	id: Buffer;
	name: string;
	symbol: string;
	decimals: number;
	brid: Buffer;
	icon_url: string;
	supply: bigint;
};
export function getChrAssetQueryObject(): QueryObject<GetChrAssetReturnType> {
	return { name: "get_chr_asset", args: undefined };
}

export function getBalanceQueryObject(accountId: Buffer): QueryObject<bigint> {
	return { name: "get_balance", args: { account_id: accountId } };
}

export function getPoolBalanceQueryObject(): QueryObject<bigint> {
	return { name: "get_pool_balance", args: undefined };
}

export function getCreateContainerTicketByTransactionQueryObject(txRid: Buffer): QueryObject<CreateContainerTicketData | null> {
	return { name: "get_create_container_ticket_by_transaction", args: { tx_rid: txRid } };
}

export function getCreateContainerTicketByIdQueryObject(ticketId: number): QueryObject<CreateContainerTicketData | null> {
	return { name: "get_create_container_ticket_by_id", args: { ticket_id: ticketId } };
}

export function getLeasesByAccountQueryObject(accountId: Buffer): QueryObject<LeaseData[]> {
	return { name: "get_leases_by_account", args: { account_id: accountId } };
}

export function getLeaseByContainerNameQueryObject(containerName: string): QueryObject<LeaseData | null> {
	return { name: "get_lease_by_container_name", args: { container_name: containerName } };
}

export function apiVersionQueryObject(): QueryObject<number> {
	return { name: "api_version", args: undefined };
}

export function registerAccountOperation(pubkey: Buffer): Operation {
	return { name: "register_account", args: [pubkey] }
}

export function initOperation(): Operation {
	return { name: "init", args: [] }
}

export function claimTestChrOperation(): Operation {
	return { name: "claim_test_chr", args: [] }
}

export function createContainerOperation(providerPubkey: Buffer,
	containerUnits: number,
	clusterClass: string,
	durationWeeks: number,
	extraStorageGib: number,
	clusterName: string,
	autoRenew: boolean): Operation {
	return { name: "create_container", args: [providerPubkey,
	containerUnits,
	clusterClass,
	durationWeeks,
	extraStorageGib,
	clusterName,
	autoRenew] }
}

export function renewContainerOperation(containerName: string,
	durationWeeks: number): Operation {
	return { name: "renew_container", args: [containerName,
	durationWeeks] }
}

export function autoRenewContainerOperation(containerName: string): Operation {
	return { name: "auto_renew_container", args: [containerName] }
}

export function cancelRenewContainerOperation(containerName: string): Operation {
	return { name: "cancel_renew_container", args: [containerName] }
}