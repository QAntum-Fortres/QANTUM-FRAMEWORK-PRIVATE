import { WhisperService } from './src/modules/GAMMA_INFRA/core/brain/strength/whisper-service';
import * as fs from 'fs';
import * as path from 'path';

async function runBenchmark() {
    console.log('Starting WhisperService benchmark...');

    const service = new WhisperService();

    // Mock the transcribe method
    service.transcribe = async (audioPath: string, language?: string) => {
        // Simulate some async work
        await new Promise(resolve => setTimeout(resolve, 10));
        return {
            text: 'MOCKED RESULT',
            language: 'en',
            languageConfidence: 1,
            segments: [],
            processingTime: 10,
            model: 'base'
        };
    };

    const bufferSize = 10 * 1024 * 1024;
    const buffer = Buffer.alloc(bufferSize, 'a');

    // Sequential Benchmark
    console.log('Running Sequential Benchmark...');
    const iterations = 10;
    const start = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        await service.transcribeBuffer(buffer, 'wav');
    }

    const end = process.hrtime.bigint();
    const totalTimeNs = end - start;
    const totalTimeMs = Number(totalTimeNs) / 1_000_000;
    const avgTimeMs = totalTimeMs / iterations;

    console.log(`Sequential Results:`);
    console.log(`  Total time: ${totalTimeMs.toFixed(2)} ms`);
    console.log(`  Average time per call: ${avgTimeMs.toFixed(2)} ms`);

    // Concurrent Benchmark
    console.log('\nRunning Concurrent Benchmark...');
    const concurrentIterations = 10;
    const startConcurrent = process.hrtime.bigint();

    await Promise.all(Array(concurrentIterations).fill(0).map(() => service.transcribeBuffer(buffer, 'wav')));

    const endConcurrent = process.hrtime.bigint();
    const totalTimeConcurrentNs = endConcurrent - startConcurrent;
    const totalTimeConcurrentMs = Number(totalTimeConcurrentNs) / 1_000_000;

    console.log(`Concurrent Results:`);
    console.log(`  Total time for ${concurrentIterations} concurrent calls: ${totalTimeConcurrentMs.toFixed(2)} ms`);
}

runBenchmark().catch(console.error);
