"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfileFromMetadata, getUserDisplayName, getUserInitials } from "@/src/lib/profile";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/client";

function NavbarAvatar({ user }) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  const profile = getProfileFromMetadata(user?.user_metadata);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  useEffect(() => {
    setAvatarBroken(false);
  }, [profile.avatarUrl]);

  return (
    <span className="navbar__profile-avatar" aria-hidden="true">
      {profile.avatarUrl && !avatarBroken ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatarUrl} alt={displayName} onError={() => setAvatarBroken(true)} />
        </>
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
}

export default function NavbarAuth({ onNavigate }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (!hasSupabaseCredentials()) {
      setUser(null);
      return undefined;
    }

    const supabase = createClient();

    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setUser(data.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (user === undefined) {
    return (
      <div className="navbar__auth navbar__auth--loading" aria-hidden="true">
        <span className="navbar__auth-skeleton" />
        <span className="navbar__auth-skeleton" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="navbar__auth">
        <Link
          href="/login?mode=login"
          className="navbar__auth-link"
          aria-label="Entrar"
          title="Entrar"
          onClick={onNavigate}
        >
          <i className="fa-solid fa-right-to-bracket" />
        </Link>
        <Link
          href="/login?mode=signup"
          className="navbar__auth-link navbar__auth-link--accent"
          aria-label="Cadastrar"
          title="Cadastrar"
          onClick={onNavigate}
        >
          <i className="fa-solid fa-user-plus" />
        </Link>
      </div>
    );
  }

  return (
    <div className="navbar__auth">
      <Link
        href="/perfil"
        className="navbar__profile-link"
        aria-label={`Abrir perfil de ${getUserDisplayName(user)}`}
        title={getUserDisplayName(user)}
        onClick={onNavigate}
      >
        <NavbarAvatar user={user} />
      </Link>
    </div>
  );
}
