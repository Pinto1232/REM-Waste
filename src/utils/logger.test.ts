import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from './logger';

const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

vi.stubGlobal('console', mockConsole);

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log debug messages', () => {
    logger.debug('Test debug message', { data: 'test' });
    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG: Test debug message'),
      { data: 'test' }
    );
  });

  it('should log info messages', () => {
    logger.info('Test info message');
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO: Test info message'),
      undefined
    );
  });

  it('should log warning messages', () => {
    logger.warn('Test warning message');
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.stringContaining('WARN: Test warning message'),
      undefined
    );
  });

  it('should log error messages', () => {
    logger.error('Test error message', new Error('Test error'));
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR: Test error message'),
      expect.any(Error)
    );
  });

  it('should include timestamp in log messages', () => {
    logger.info('Test message');
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/),
      undefined
    );
  });
});