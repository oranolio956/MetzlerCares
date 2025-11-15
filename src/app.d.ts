// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {
	Beneficiary,
	User,
	Application,
	Partner,
	Consent,
	KPIMetrics,
	ImpactMetrics,
	Resource,
	PageData,
	ApplicationFormData,
	PartnerFormData,
	LoginFormData,
	FormError
} from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			supabase: import('@supabase/auth-helpers-sveltekit').SupabaseClient
			getSession: () => Promise<import('@supabase/supabase-js').Session | null>
		}

		interface PageData {
			user?: User | null;
			beneficiary?: Beneficiary | null;
			application?: Application | null;
			applications?: Application[];
			partners?: Partner[];
			consents?: Consent[];
			kpis?: KPIMetrics;
			metrics?: ImpactMetrics;
			resources?: Resource[];
			pageData?: PageData;
			pendingApplications?: Application[];
			disburseApplications?: Application[];
		}

		interface PageState {}

		interface Platform {}
	}
}

// Form action types
export type ApplyAction = {
	request: Request;
	locals: App.Locals;
} & {
	formData: ApplicationFormData;
};

export type LoginAction = {
	request: Request;
	locals: App.Locals;
} & {
	formData: LoginFormData;
};

export {};
