"use client";

// ==============================================
// Settings Page - Profile + Change Password
// ==============================================

import { useEffect, useState } from "react";
import { authApi, User } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
    const { updateUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        authApi
            .me()
            .then((res) => {
                if (res?.data?.user) {
                    setUser(res.data.user);
                    setName(res.data.user.name);
                }
            })
            .catch(() => {});
    }, []);

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || name.trim().length < 2) {
            toast.error("Username minimal 2 karakter");
            return;
        }
        setIsSavingProfile(true);
        try {
            const res = await authApi.updateMe({ name: name.trim() });
            if (res?.data?.user) {
                setUser(res.data.user);
                setName(res.data.user.name);
                updateUser(res.data.user);
            }
            toast.success("Profil berhasil diperbarui");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil");
        } finally {
            setIsSavingProfile(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password baru minimal 6 karakter");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Konfirmasi password tidak cocok");
            return;
        }
        setIsSavingPassword(true);
        try {
            await authApi.changePassword({ currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password berhasil diubah");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal mengubah password");
        } finally {
            setIsSavingPassword(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Kelola profil dan keamanan akun Anda.
                </p>
            </div>

            {/* Profile card */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Profil</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Perbarui username di akun Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">Username</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-background border-input text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <Input
                                id="email"
                                value={user?.email ?? ""}
                                disabled
                                className="bg-muted/50 border-input text-muted-foreground cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
                        </div>
                        <Button type="submit" variant="brand" disabled={isSavingProfile}>
                            {isSavingProfile ? "Menyimpan..." : "Simpan Profil"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change password card */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Ganti Password</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Pastikan akun Anda menggunakan password yang sulit ditebak.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-foreground">Password Saat Ini</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="bg-background border-input text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-foreground">Password Baru</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="bg-background border-input text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-foreground">Konfirmasi Password Baru</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-background border-input text-foreground"
                            />
                        </div>
                        <Button type="submit" variant="brand" disabled={isSavingPassword}>
                            {isSavingPassword ? "Menyimpan..." : "Ubah Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
