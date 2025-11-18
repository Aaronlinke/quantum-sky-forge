--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Generate DID identifier
  INSERT INTO public.profiles (id, did_identifier, display_name)
  VALUES (
    NEW.id,
    'did:web4:' || NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: agent_interactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agent_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    agent_id uuid NOT NULL,
    input_data jsonb NOT NULL,
    output_data jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    version text DEFAULT '1.0.0'::text NOT NULL,
    icon text,
    capabilities jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    install_count integer DEFAULT 0 NOT NULL,
    rating numeric(3,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: consent_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consent_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    agent_id text NOT NULL,
    data_type text NOT NULL,
    action text NOT NULL,
    granted boolean NOT NULL,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: data_pods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_pods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    data_type text NOT NULL,
    encrypted_data text NOT NULL,
    access_rules jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: knowledge_edges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_edges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    source_node_id uuid NOT NULL,
    target_node_id uuid NOT NULL,
    edge_type text NOT NULL,
    properties jsonb DEFAULT '{}'::jsonb,
    weight numeric DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT different_nodes CHECK ((source_node_id <> target_node_id))
);


--
-- Name: knowledge_nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    node_type text NOT NULL,
    label text NOT NULL,
    properties jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    did_identifier text,
    public_key text,
    verification_method jsonb,
    display_name text,
    avatar_url text,
    bio text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: semantic_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.semantic_queries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    query_text text NOT NULL,
    query_type text NOT NULL,
    results jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    agent_id uuid NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    installed_at timestamp with time zone DEFAULT now(),
    last_used_at timestamp with time zone
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: agent_interactions agent_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_interactions
    ADD CONSTRAINT agent_interactions_pkey PRIMARY KEY (id);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: consent_logs consent_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consent_logs
    ADD CONSTRAINT consent_logs_pkey PRIMARY KEY (id);


--
-- Name: data_pods data_pods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_pods
    ADD CONSTRAINT data_pods_pkey PRIMARY KEY (id);


--
-- Name: knowledge_edges knowledge_edges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_edges
    ADD CONSTRAINT knowledge_edges_pkey PRIMARY KEY (id);


--
-- Name: knowledge_nodes knowledge_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_nodes
    ADD CONSTRAINT knowledge_nodes_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_did_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_did_identifier_key UNIQUE (did_identifier);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: semantic_queries semantic_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.semantic_queries
    ADD CONSTRAINT semantic_queries_pkey PRIMARY KEY (id);


--
-- Name: user_agents user_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agents
    ADD CONSTRAINT user_agents_pkey PRIMARY KEY (id);


--
-- Name: user_agents user_agents_user_id_agent_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agents
    ADD CONSTRAINT user_agents_user_id_agent_id_key UNIQUE (user_id, agent_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_knowledge_edges_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges USING btree (source_node_id);


--
-- Name: idx_knowledge_edges_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges USING btree (target_node_id);


--
-- Name: idx_knowledge_edges_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_edges_user_id ON public.knowledge_edges USING btree (user_id);


--
-- Name: idx_knowledge_nodes_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_nodes_type ON public.knowledge_nodes USING btree (node_type);


--
-- Name: idx_knowledge_nodes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_nodes_user_id ON public.knowledge_nodes USING btree (user_id);


--
-- Name: idx_semantic_queries_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_semantic_queries_user_id ON public.semantic_queries USING btree (user_id);


--
-- Name: agents update_agents_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: data_pods update_data_pods_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_data_pods_updated_at BEFORE UPDATE ON public.data_pods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: knowledge_nodes update_knowledge_nodes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_knowledge_nodes_updated_at BEFORE UPDATE ON public.knowledge_nodes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: agent_interactions agent_interactions_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_interactions
    ADD CONSTRAINT agent_interactions_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: agent_interactions agent_interactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_interactions
    ADD CONSTRAINT agent_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: consent_logs consent_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consent_logs
    ADD CONSTRAINT consent_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: data_pods data_pods_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_pods
    ADD CONSTRAINT data_pods_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: knowledge_edges knowledge_edges_source_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_edges
    ADD CONSTRAINT knowledge_edges_source_node_id_fkey FOREIGN KEY (source_node_id) REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE;


--
-- Name: knowledge_edges knowledge_edges_target_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_edges
    ADD CONSTRAINT knowledge_edges_target_node_id_fkey FOREIGN KEY (target_node_id) REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_agents user_agents_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agents
    ADD CONSTRAINT user_agents_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: user_agents user_agents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_agents
    ADD CONSTRAINT user_agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agents Admins can manage agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage agents" ON public.agents USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: agents Anyone can view active agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active agents" ON public.agents FOR SELECT USING ((is_active = true));


--
-- Name: profiles Profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT TO authenticated USING (true);


--
-- Name: consent_logs Users can create consent logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create consent logs" ON public.consent_logs FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: agent_interactions Users can create interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create interactions" ON public.agent_interactions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: data_pods Users can create their own data pods; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own data pods" ON public.data_pods FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: knowledge_edges Users can create their own edges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own edges" ON public.knowledge_edges FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: knowledge_nodes Users can create their own nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own nodes" ON public.knowledge_nodes FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: semantic_queries Users can create their own queries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own queries" ON public.semantic_queries FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: data_pods Users can delete their own data pods; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own data pods" ON public.data_pods FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: knowledge_edges Users can delete their own edges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own edges" ON public.knowledge_edges FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: knowledge_nodes Users can delete their own nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own nodes" ON public.knowledge_nodes FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: user_agents Users can install agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can install agents" ON public.user_agents FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_agents Users can uninstall agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can uninstall agents" ON public.user_agents FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_agents Users can update their agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their agents" ON public.user_agents FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: consent_logs Users can update their own consent logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own consent logs" ON public.consent_logs FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: data_pods Users can update their own data pods; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own data pods" ON public.data_pods FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: knowledge_edges Users can update their own edges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own edges" ON public.knowledge_edges FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: knowledge_nodes Users can update their own nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own nodes" ON public.knowledge_nodes FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: user_agents Users can view their installed agents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their installed agents" ON public.user_agents FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: agent_interactions Users can view their interactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their interactions" ON public.agent_interactions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: consent_logs Users can view their own consent logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own consent logs" ON public.consent_logs FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: data_pods Users can view their own data pods; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own data pods" ON public.data_pods FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: knowledge_edges Users can view their own edges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own edges" ON public.knowledge_edges FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: knowledge_nodes Users can view their own nodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own nodes" ON public.knowledge_nodes FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: semantic_queries Users can view their own queries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own queries" ON public.semantic_queries FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: agent_interactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;

--
-- Name: agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

--
-- Name: consent_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: data_pods; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.data_pods ENABLE ROW LEVEL SECURITY;

--
-- Name: knowledge_edges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;

--
-- Name: knowledge_nodes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: semantic_queries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.semantic_queries ENABLE ROW LEVEL SECURITY;

--
-- Name: user_agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_agents ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


