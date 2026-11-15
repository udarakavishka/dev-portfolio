'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME_EVENT } from '@/lib/theme';

// "The portfolio boots like a cluster": nodes come online one by one when the hero is reached,
// links light up between them, packets travel the links. Decorative only; hidden from assistive
// tech by the parent.

// Deterministic PRNG so the graph is the same on every visit.
function mulberry32(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

interface Graph {
    nodes: THREE.Vector3[];
    edges: [number, number][];
    bootAt: number[];
}

function buildGraph(count: number): Graph {
    const rand = mulberry32(7);
    const nodes: THREE.Vector3[] = [];
    while (nodes.length < count) {
        // A flattened ellipsoid reads as a cluster map rather than a ball
        const v = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1);
        if (v.length() > 1) continue;
        nodes.push(new THREE.Vector3(v.x * 4.6, v.y * 2.6, v.z * 2.2));
    }
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    nodes.forEach((a, i) => {
        const nearest = nodes
            .map((b, j) => ({ j, d: a.distanceTo(b) }))
            .filter(({ j }) => j !== i)
            .sort((x, y) => x.d - y.d)
            .slice(0, 2);
        nearest.forEach(({ j }) => {
            const key = i < j ? `${i}-${j}` : `${j}-${i}`;
            if (!seen.has(key)) {
                seen.add(key);
                edges.push([i, j]);
            }
        });
    });
    // Nodes boot from the centre outward, like pods scheduling across a cluster
    const order = nodes.map((n, i) => ({ i, d: n.length() })).sort((a, b) => a.d - b.d);
    const bootAt = new Array(count).fill(0);
    order.forEach(({ i }, rank) => {
        bootAt[i] = 0.25 + rank * (1.8 / count) + rand() * 0.15;
    });
    return { nodes, edges, bootAt };
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

function readAccent() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
    return new THREE.Color(raw || '#4ade80');
}

function Cluster({
    count,
    offsetX,
    pointer,
}: {
    count: number;
    offsetX: number;
    pointer: React.RefObject<{ x: number; y: number }>;
}) {
    const graph = useMemo(() => buildGraph(count), [count]);
    const group = useRef<THREE.Group>(null);
    const nodesMesh = useRef<THREE.InstancedMesh>(null);
    const packetsMesh = useRef<THREE.InstancedMesh>(null);
    const start = useRef<number | null>(null);
    const [accent, setAccent] = useState(() => readAccent());

    useEffect(() => {
        const update = () => setTimeout(() => setAccent(readAccent()), 0);
        window.addEventListener(THEME_EVENT, update);
        return () => window.removeEventListener(THEME_EVENT, update);
    }, []);

    const linePositions = useMemo(() => {
        const arr = new Float32Array(graph.edges.length * 6);
        graph.edges.forEach(([a, b], k) => {
            graph.nodes[a].toArray(arr, k * 6);
            graph.nodes[b].toArray(arr, k * 6 + 3);
        });
        return arr;
    }, [graph]);
    const lineColors = useMemo(() => new Float32Array(graph.edges.length * 6), [graph]);
    const lineGeo = useRef<THREE.BufferGeometry>(null);

    const packets = useMemo(() => {
        const rand = mulberry32(42);
        return Array.from({ length: Math.round(count / 3) }, () => ({
            edge: Math.floor(rand() * graph.edges.length),
            t: rand(),
            speed: 0.12 + rand() * 0.25,
        }));
    }, [count, graph.edges.length]);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const dim = useMemo(() => new THREE.Color(), []);
    const tmp = useMemo(() => new THREE.Color(), []);
    const tilt = useRef({ x: 0, y: 0 });

    useFrame((state, delta) => {
        if (start.current === null) start.current = state.clock.elapsedTime;
        const t = state.clock.elapsedTime - start.current;
        const g = group.current;
        if (!g || !nodesMesh.current || !packetsMesh.current || !lineGeo.current) return;

        // Pointer tilt on a critically damped follow; slow idle drift on top
        const p = pointer.current ?? { x: 0, y: 0 };
        const k = 1 - Math.exp(-delta * 3);
        tilt.current.x += (p.y * 0.18 - tilt.current.x) * k;
        tilt.current.y += (p.x * 0.3 - tilt.current.y) * k;
        g.rotation.x = tilt.current.x;
        g.rotation.y = tilt.current.y + t * 0.04;

        dim.copy(accent).multiplyScalar(0.18);

        graph.nodes.forEach((n, i) => {
            const on = easeOut((t - graph.bootAt[i]) / 0.5);
            const pulse = on >= 1 ? 1 + Math.sin(t * 1.6 + i) * 0.12 : 1;
            dummy.position.copy(n);
            dummy.position.y += Math.sin(t * 0.5 + i * 1.3) * 0.06;
            // Each node drifts forward into place as it comes online
            dummy.position.z -= (1 - on) * 4;
            dummy.scale.setScalar((0.35 + on * 0.65) * pulse);
            dummy.updateMatrix();
            nodesMesh.current!.setMatrixAt(i, dummy.matrix);
            tmp.copy(dim).lerp(accent, on);
            nodesMesh.current!.setColorAt(i, tmp);
        });
        nodesMesh.current.instanceMatrix.needsUpdate = true;
        if (nodesMesh.current.instanceColor) nodesMesh.current.instanceColor.needsUpdate = true;

        graph.edges.forEach(([a, b], e) => {
            const on = Math.min(easeOut((t - graph.bootAt[a] - 0.3) / 0.6), easeOut((t - graph.bootAt[b] - 0.3) / 0.6));
            tmp.copy(accent).multiplyScalar(0.06 + on * 0.34);
            tmp.toArray(lineColors, e * 6);
            tmp.toArray(lineColors, e * 6 + 3);
        });
        (lineGeo.current.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;

        const boot = easeOut((t - 2.2) / 0.8);
        packets.forEach((pk, i) => {
            pk.t += delta * pk.speed;
            if (pk.t > 1) {
                pk.t = 0;
                pk.edge = (pk.edge * 7 + 3) % graph.edges.length;
            }
            const [a, b] = graph.edges[pk.edge];
            dummy.position.lerpVectors(graph.nodes[a], graph.nodes[b], pk.t);
            dummy.scale.setScalar(boot * Math.sin(pk.t * Math.PI));
            dummy.updateMatrix();
            packetsMesh.current!.setMatrixAt(i, dummy.matrix);
        });
        packetsMesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={group} position={[offsetX, 0, 0]}>
            <lineSegments>
                <bufferGeometry ref={lineGeo}>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
                </bufferGeometry>
                <lineBasicMaterial vertexColors transparent opacity={0.9} depthWrite={false} />
            </lineSegments>
            <instancedMesh ref={nodesMesh} args={[undefined, undefined, graph.nodes.length]}>
                <icosahedronGeometry args={[0.055, 1]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
            <instancedMesh ref={packetsMesh} args={[undefined, undefined, packets.length]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
            </instancedMesh>
        </group>
    );
}

export default function HeroScene() {
    const wrap = useRef<HTMLDivElement>(null);
    const pointer = useRef({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [layout] = useState(() => {
        const wide = typeof window !== 'undefined' && window.innerWidth >= 1024;
        return { count: wide ? 60 : 34, offsetX: wide ? 1.6 : 0 };
    });

    // Stop rendering entirely when the hero is off-screen
    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
        io.observe(el);
        // Mouse hover or a finger dragging across the screen both steer the tilt
        const onMove = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => {
            io.disconnect();
            window.removeEventListener('pointermove', onMove);
        };
    }, []);

    return (
        <div ref={wrap} style={{ position: 'absolute', inset: 0 }}>
            <Canvas
                frameloop={visible ? 'always' : 'never'}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 8.5], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            >
                <Cluster count={layout.count} offsetX={layout.offsetX} pointer={pointer} />
            </Canvas>
        </div>
    );
}
