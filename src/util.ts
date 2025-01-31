import path from "path";
import { readFileSync, writeFileSync, readdirSync } from "fs";

const classes: Record<string, string> = JSON.parse(readFileSync(path.join(__dirname, "class-mapping.json"), "utf8"));

export function getScssFiles(basePath?: string, ignoreList: string[] = []) {
    const root = process.cwd();

    const files = readdirSync(
        path.join(root, basePath || ''),
        { recursive: true, withFileTypes: true },
    );

    const scssFiles = files
        .filter((file) => file.isFile())
        .filter((file) => !ignoreList.includes(file.name))
        .filter((file) => 
            file.name.endsWith('.scss') || file.name.endsWith('.css')
        );

    return scssFiles.map((file) => path.join(file.parentPath, file.name));
}

export function readFile(path: string) {
    return readFileSync(path, "utf8");
}

export function writeFile(path: string, data: string) {
    return writeFileSync(path, data, "utf8");
}

export function replaceClasses(lines: string[]) {
    const regex = new RegExp(/(?<class_name>(?<=\.)[A-Za-z0-9\-\_]+)/gm);

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const matches = line.matchAll(regex).toArray();

        if (!matches.length) continue;

        for (const match of matches) {
            if (!match.groups) continue;

            const groups = match.groups as { class_name: string };
            const className = groups.class_name;

            if (!classes[className]) continue;

            line = line.replace(
                new RegExp(`\\b${className}\\b`, 'g'),
                classes[className]
            );
        }

        lines[i] = line;
    }

    return lines;
}