import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Doctor, DoctorFilterParams } from '../models/doctor.model';
import { MOCK_DOCTORS } from '../../data/mock/doctors.mock';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private doctors: Doctor[] = MOCK_DOCTORS;

  getDoctors(params?: DoctorFilterParams): Observable<Doctor[]> {
    let result = [...this.doctors];

    if (!params) {
      return of(result);
    }

    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase().trim();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.qualification.toLowerCase().includes(q) ||
          doc.specializations.some((s) => s.toLowerCase().includes(q)) ||
          doc.languages.some((l) => l.toLowerCase().includes(q)) ||
          doc.bio.toLowerCase().includes(q)
      );
    }

    if (params.specialization) {
      result = result.filter((doc) =>
        doc.specializations.some(
          (s) => s.toLowerCase().includes(params.specialization!.toLowerCase())
        )
      );
    }

    if (params.language) {
      result = result.filter((doc) =>
        doc.languages.some((l) => l.toLowerCase() === params.language!.toLowerCase())
      );
    }

    if (params.gender) {
      result = result.filter((doc) => doc.gender === params.gender);
    }

    if (params.consultationType) {
      result = result.filter((doc) => doc.consultationTypes.includes(params.consultationType!));
    }

    if (params.maxFee && params.maxFee > 0) {
      result = result.filter((doc) => doc.consultationFeeInINR <= params.maxFee!);
    }

    if (params.verificationStatus) {
      result = result.filter((doc) => doc.verificationStatus === params.verificationStatus);
    }

    return of(result);
  }

  getDoctorById(id: string): Observable<Doctor | undefined> {
    const doc = this.doctors.find((d) => d.id === id);
    return of(doc);
  }

  getSpecializations(): string[] {
    const specs = new Set<string>();
    this.doctors.forEach((d) => d.specializations.forEach((s) => specs.add(s)));
    return Array.from(specs);
  }

  getLanguages(): string[] {
    const langs = new Set<string>();
    this.doctors.forEach((d) => d.languages.forEach((l) => langs.add(l)));
    return Array.from(langs);
  }
}
