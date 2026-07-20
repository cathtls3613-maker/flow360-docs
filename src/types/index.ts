/**
 * Shared type definitions used across engines and features.
 */

/** A universally unique identifier (PostgreSQL `uuid`). */
export type UUID = string;

/** An ISO-8601 timestamp string, e.g. "2026-07-14T12:00:00Z". */
export type ISODateTime = string;

/**
 * Base shape of every business record in FLOW360.
 *
 * Multi-tenant rule: every business table carries these columns, and
 * Row Level Security ensures a company can only ever see rows with its
 * own `companyId`.
 */
export interface TenantEntity {
  id: UUID;
  /** The company (tenant) this record belongs to. */
  companyId: UUID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  /** User who created the record — part of the audit trail. */
  createdBy: UUID;
  /** User who last changed the record — part of the audit trail. */
  updatedBy: UUID;
  /** Soft-delete / archive flag. Records are deactivated, never erased. */
  isActive: boolean;
}

/** Standard shape for paginated list results. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
