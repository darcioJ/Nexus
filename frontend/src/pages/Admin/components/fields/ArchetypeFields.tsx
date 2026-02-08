import { InputGroup } from '../InputGroup';

import { ItemInput } from '../../../../components/common/ItemInput';
import { IconInput } from '../../../../components/common/IconInput';

import { type IItem } from '../../../../services/vaultService';

interface ArchetypeFieldsProps {
  watch: unknown;
  setValue: unknown;
}

export const ArchetypeFields = ({ register, watch, setValue }: ArchetypeFieldsProps) => {
  // Observa o array de itens diretamente do estado do formulário
  const items: IItem[] = watch('items') || [];

  const handleItemsChange = (newItems: IItem[]) => {
    // Atualiza o valor no react-hook-form como um array de objetos (IItem[])
    setValue('items', newItems, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <>
      <div className="col-span-2 pt-2">
        <InputGroup label="Configuração de Arsenal Inicial">
          <ItemInput
            label="Kit de Iniciação (Equipamento)"
            items={items}
            onChange={handleItemsChange}
          />
        </InputGroup>
      </div>

      <div className="col-span-2 z-50">
        <InputGroup label="Assinatura Visual (Ícone Lucide)">
          <IconInput
            register={register}
            watch={watch}
            setValue={setValue}
            name="iconName"
          />
        </InputGroup>
      </div>
    </>
  );
};