"use client";

import { useState } from "react";
import AvatarUploader from "@/src/components/auth/AvatarUploader";
import {
  PERSON_TYPE_OPTIONS,
  QUILOMBOLA_REGION_OPTIONS,
  RACIAL_IDENTITY_OPTIONS,
  STUDENT_LEVEL_OPTIONS,
  isInstitutionLinkedType,
  isQuilombolaType,
  isStudentType,
} from "@/src/lib/profile";

export default function ProfileFields({
  initialProfile = {},
  idPrefix = "profile",
  allowAvatarUpload = false,
  userId = "",
}) {
  const [personType, setPersonType] = useState(initialProfile.personType || "");

  const showInstitution = isInstitutionLinkedType(personType);
  const showStudentLevel = isStudentType(personType);
  const showQuilombolaFields = isQuilombolaType(personType);

  return (
    <>
      <div className="login-form__grid">
        <div className="login-form__field">
          <label htmlFor={`${idPrefix}-fullName`}>Nome completo</label>
          <input
            id={`${idPrefix}-fullName`}
            name="fullName"
            type="text"
            defaultValue={initialProfile.fullName || ""}
            autoComplete="name"
            minLength="3"
            placeholder="Como voce quer aparecer no site"
            required
          />
        </div>

        <div className="login-form__field">
          <label htmlFor={`${idPrefix}-phone`}>Telefone</label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            defaultValue={initialProfile.phone || ""}
            autoComplete="tel"
            placeholder="(98) 99999-9999"
            required
          />
        </div>

        <div className="login-form__field">
          <label htmlFor={`${idPrefix}-personType`}>Tipo de pessoa</label>
          <select
            id={`${idPrefix}-personType`}
            name="personType"
            value={personType}
            onChange={(event) => setPersonType(event.target.value)}
            required
          >
            <option value="">Selecione</option>
            {PERSON_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="login-form__field">
          <label htmlFor={`${idPrefix}-racialIdentity`}>Raca / identidade</label>
          <select
            id={`${idPrefix}-racialIdentity`}
            name="racialIdentity"
            defaultValue={initialProfile.racialIdentity || ""}
            required
          >
            <option value="">Selecione</option>
            {RACIAL_IDENTITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showInstitution && (
          <div className="login-form__field login-form__field--wide">
            <label htmlFor={`${idPrefix}-institution`}>Instituicao vinculada</label>
            <input
              id={`${idPrefix}-institution`}
              name="institution"
              type="text"
              defaultValue={initialProfile.institution || ""}
              autoComplete="organization"
              placeholder="Escola, universidade, instituto ou organizacao"
              required
            />
          </div>
        )}

        {showStudentLevel && (
          <div className="login-form__field">
            <label htmlFor={`${idPrefix}-studentLevel`}>Nivel de ensino</label>
            <select
              id={`${idPrefix}-studentLevel`}
              name="studentLevel"
              defaultValue={initialProfile.studentLevel || ""}
              required
            >
              <option value="">Selecione</option>
              {STUDENT_LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showQuilombolaFields && (
          <div className="login-form__field">
            <label htmlFor={`${idPrefix}-quilombolaRegion`}>Regiao quilombola</label>
            <select
              id={`${idPrefix}-quilombolaRegion`}
              name="quilombolaRegion"
              defaultValue={initialProfile.quilombolaRegion || ""}
              required
            >
              <option value="">Selecione</option>
              {QUILOMBOLA_REGION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showQuilombolaFields && (
          <div className="login-form__field">
            <label htmlFor={`${idPrefix}-quilombolaCommunity`}>Comunidade de origem</label>
            <input
              id={`${idPrefix}-quilombolaCommunity`}
              name="quilombolaCommunity"
              type="text"
              defaultValue={initialProfile.quilombolaCommunity || ""}
              placeholder="Nome da comunidade"
              required
            />
          </div>
        )}

        <div className="login-form__field login-form__field--wide">
          <label htmlFor={`${idPrefix}-culturalConnection`}>Relacao com raca e cultura afro-brasileira</label>
          <textarea
            id={`${idPrefix}-culturalConnection`}
            name="culturalConnection"
            defaultValue={initialProfile.culturalConnection || ""}
            placeholder="Conte sua ligacao com o tema, com o territorio ou com a pesquisa."
            rows="4"
          />
          <span className="login-form__hint">Campo opcional, util para contextualizar o perfil.</span>
        </div>
      </div>

      {allowAvatarUpload && userId ? (
        <AvatarUploader
          userId={userId}
          initialAvatarUrl={initialProfile.avatarUrl || ""}
          initialAvatarPath={initialProfile.avatarPath || ""}
        />
      ) : (
        <div className="login-form__hint login-form__hint--panel">
          A foto de perfil pode ser enviada depois do primeiro login, dentro da pagina de perfil.
        </div>
      )}
    </>
  );
}
