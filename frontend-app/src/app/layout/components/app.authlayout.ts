import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="auth-shell">
            <section class="auth-shell__panel" aria-label="JobPortal overview">
                <div class="auth-shell__eyebrow">JobPortal Workspace</div>
                <h1>Recruitment operations without the spreadsheet chaos.</h1>
                <p>
                    Track openings, screen candidates, and manage applications from a single workspace designed for modern hiring teams.
                </p>

                <div class="auth-shell__metrics" aria-label="Platform highlights">
                    <article>
                        <strong>24/7</strong>
                        <span>Visibility into jobs, candidates, and applications</span>
                    </article>
                    <article>
                        <strong>3x</strong>
                        <span>Faster handoff between recruiters and employers</span>
                    </article>
                    <article>
                        <strong>One place</strong>
                        <span>Hiring data, status updates, and candidate actions</span>
                    </article>
                </div>
            </section>

            <section class="auth-shell__stage">
                <router-outlet></router-outlet>
            </section>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
            background:
                radial-gradient(circle at top left, rgba(255, 201, 153, 0.45), transparent 28%),
                radial-gradient(circle at bottom right, rgba(88, 121, 255, 0.22), transparent 32%),
                linear-gradient(135deg, #f7efe7 0%, #eef3ff 50%, #f7f9fc 100%);
        }

        .auth-shell {
            min-height: 100vh;
            display: grid;
            grid-template-columns: minmax(320px, 1.05fr) minmax(420px, 0.95fr);
            gap: 2rem;
            padding: clamp(1.25rem, 2.5vw, 2.5rem);
        }

        .auth-shell__panel {
            position: relative;
            overflow: hidden;
            border-radius: 2rem;
            padding: clamp(2rem, 4vw, 4rem);
            background:
                linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08)),
                linear-gradient(145deg, #11314d 0%, #214d72 45%, #246a73 100%);
            box-shadow: 0 30px 80px rgba(17, 49, 77, 0.22);
            color: #f8fbff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: min(760px, calc(100vh - 5rem));
        }

        .auth-shell__panel::before,
        .auth-shell__panel::after {
            content: '';
            position: absolute;
            border-radius: 999px;
            pointer-events: none;
        }

        .auth-shell__panel::before {
            width: 18rem;
            height: 18rem;
            top: -5rem;
            right: -4rem;
            background: rgba(255, 255, 255, 0.1);
        }

        .auth-shell__panel::after {
            width: 12rem;
            height: 12rem;
            bottom: 3rem;
            left: -2rem;
            background: rgba(255, 184, 108, 0.16);
        }

        .auth-shell__eyebrow {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            width: fit-content;
            border-radius: 999px;
            padding: 0.45rem 0.85rem;
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .auth-shell__panel h1,
        .auth-shell__panel p,
        .auth-shell__metrics {
            position: relative;
            z-index: 1;
        }

        .auth-shell__panel h1 {
            margin: 1.5rem 0 1rem;
            max-width: 12ch;
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            line-height: 0.98;
            font-weight: 800;
            letter-spacing: -0.04em;
        }

        .auth-shell__panel p {
            margin: 0;
            max-width: 34rem;
            font-size: 1.05rem;
            line-height: 1.75;
            color: rgba(248, 251, 255, 0.82);
        }

        .auth-shell__metrics {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1rem;
            margin-top: 3rem;
        }

        .auth-shell__metrics article {
            padding: 1.1rem 1rem;
            border-radius: 1.3rem;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
        }

        .auth-shell__metrics strong {
            display: block;
            margin-bottom: 0.45rem;
            font-size: 1.35rem;
            font-weight: 800;
        }

        .auth-shell__metrics span {
            display: block;
            font-size: 0.9rem;
            line-height: 1.55;
            color: rgba(248, 251, 255, 0.82);
        }

        .auth-shell__stage {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: min(760px, calc(100vh - 5rem));
        }

        @media (max-width: 1024px) {
            .auth-shell {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .auth-shell__panel,
            .auth-shell__stage {
                min-height: auto;
            }

            .auth-shell__panel h1 {
                max-width: 14ch;
            }
        }

        @media (max-width: 720px) {
            .auth-shell {
                padding: 1rem;
            }

            .auth-shell__panel {
                border-radius: 1.5rem;
                padding: 1.5rem;
            }

            .auth-shell__panel h1 {
                font-size: 2.35rem;
            }

            .auth-shell__metrics {
                grid-template-columns: 1fr;
            }
        }
    `]
})
export class AppAuthLayout {}
