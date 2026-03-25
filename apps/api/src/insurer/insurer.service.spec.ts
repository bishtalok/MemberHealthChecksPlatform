import { Test, TestingModule } from '@nestjs/testing';
import { InsurerService } from './insurer.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InsurerService', () => {
  let service: InsurerService;
  let prisma: PrismaService;

  const mockPrisma = {
    member: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    healthCheckJourney: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsurerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InsurerService>(InsurerService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should create member and journey for new member', async () => {
    mockPrisma.member.findUnique.mockResolvedValue(null);
    mockPrisma.member.create.mockResolvedValue({
      id: 'member-1',
      insurer_member_id: 'VTL-99999',
    });
    mockPrisma.healthCheckJourney.findFirst.mockResolvedValue(null);
    mockPrisma.healthCheckJourney.create.mockResolvedValue({
      id: 'journey-1',
    });

    const result = await service.handleHandoff({
      insurer_member_id: 'VTL-99999',
      insurer_code: 'vitality',
      eligibility_token: 'valid-token',
    });

    expect(result.journey_id).toBe('journey-1');
    expect(result.redirect_url).toBe('/journey/journey-1/consent');
    expect(mockPrisma.member.create).toHaveBeenCalledWith({
      data: {
        insurer_member_id: 'VTL-99999',
        insurer_code: 'vitality',
      },
    });
  });

  it('should return existing INITIATED journey (idempotency)', async () => {
    mockPrisma.member.findUnique.mockResolvedValue({
      id: 'member-1',
      insurer_member_id: 'VTL-12345',
    });
    mockPrisma.healthCheckJourney.findFirst.mockResolvedValue({
      id: 'existing-journey',
    });

    const result = await service.handleHandoff({
      insurer_member_id: 'VTL-12345',
      insurer_code: 'vitality',
      eligibility_token: 'valid-token',
    });

    expect(result.journey_id).toBe('existing-journey');
    expect(mockPrisma.healthCheckJourney.create).not.toHaveBeenCalled();
  });

  it('should throw on missing eligibility token', async () => {
    await expect(
      service.handleHandoff({
        insurer_member_id: 'VTL-12345',
        insurer_code: 'vitality',
        eligibility_token: '',
      }),
    ).rejects.toThrow('Invalid eligibility token');
  });
});
