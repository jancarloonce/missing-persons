// components/Header.tsx
"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return null;

  const initial = (profile?.username ?? "?").charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-900"
        >
          MissingPH
        </Link>
        <nav className="flex items-center space-x-4">

          <Link
            href="/cases/new"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Post
          </Link>

          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="focus:outline-none">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {initial}
                    </span>
                  </div>
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        Edit Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          logout();
                          router.push("/");
                        }}
                        className={`w-full text-left px-4 py-2 text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 border rounded hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
