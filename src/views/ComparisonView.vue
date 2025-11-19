<template>
  <div class="mx-2 md:mx-5 lg:mx-10 xl:mx-32 2xl:mx-60 3xl:mx-80">
    <div class="text-center mb-8 mt-8 relative">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">
        {{ t.title }}
      </h1>
      <p class="text-sm md:text-base text-neutral-600">
        {{ t.subtitle }}
      </p>
      <button
        @click="exportPdf"
        class="absolute top-0 right-0 mt-0 mr-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm inline-flex items-center gap-2 print:hidden transition-colors"
        :title="t.exportPdf"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span class="hidden sm:inline">{{ t.exportPdf }}</span>
      </button>
    </div>

    <!-- Formulário de entrada -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8 print:hidden">
      <h2 class="text-xl font-semibold mb-4">{{ t.simulationParams }}</h2>
      
      <div class="space-y-6">
        <!-- Linha Principal: Rendimento, Frequência, Ano -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <!-- Rendimento Bruto -->
          <div class="md:col-span-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.grossIncome }}
              <InfoButton>
                <p class="text-sm w-64 text-center">
                  {{ t.grossIncomeTooltip }}
                </p>
              </InfoButton>
            </label>
            <FormattedNumberInput
              :value="internalIncome"
              @update:value="internalIncome = $event"
              :placeholder="getIncomePlaceholder"
              class="w-full"
              data-cy="comparison-income"
            />
          </div>

          <!-- Frequência -->
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-gray-700 mb-2 md:invisible">
              Frequência
            </label>
            <div class="flex border border-gray-300 rounded overflow-hidden bg-white h-[42px]">
              <button
                v-for="frequencyChoice in Object.keys(FrequencyChoices)"
                :key="frequencyChoice"
                class="flex-1 px-3 py-2 text-sm font-medium transition focus:outline-none focus:bg-gray-50"
                :class="{
                  'bg-indigo-600 text-white': comparisonStore.incomeFrequency === FrequencyChoices[frequencyChoice],
                  'text-gray-700 hover:bg-gray-50': comparisonStore.incomeFrequency !== FrequencyChoices[frequencyChoice],
                }"
                @click="setIncomeFrequency(frequencyChoice)"
                :title="getFrequencyTitle(frequencyChoice)"
              >
                {{ getFrequencyLabel(frequencyChoice) }}
              </button>
            </div>
          </div>

          <!-- Ano Fiscal -->
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.taxYear }}
            </label>
            <DropDown
              :choices="SUPPORTED_TAX_RANK_YEARS"
              @change="changeCurrentTaxRankYear"
              :value="comparisonStore.currentTaxRankYear.toString()"
              class="w-full"
            />
          </div>
        </div>

        <!-- Linha Secundária: VAT e CTI Months -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
          <div class="flex items-center">
            <input
              id="vat-toggle"
              type="checkbox"
              :checked="comparisonStore.vatEnabled"
              @change="comparisonStore.setVatEnabled(($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="vat-toggle" class="ml-2 block text-sm text-gray-900 select-none cursor-pointer">
              {{ t.chargeVat }}
            </label>
          </div>

          <div class="flex items-center gap-4">
            <label class="block text-sm font-medium text-gray-700 whitespace-nowrap">
              {{ t.ctiMonths }}
              <InfoButton>
                <p class="text-sm w-64 text-center">
                  {{ t.ctiMonthsTooltip }}
                </p>
              </InfoButton>
            </label>
            <AdjustCounter
              :value="comparisonStore.ctiMonths"
              @update:value="comparisonStore.setCtiMonths"
              :min="12"
              :max="14"
              :unit="t.months"
              class="flex-1"
            />
          </div>
        </div>
      </div>

      <!-- Benefícios Fiscais para Recibos Verdes (Separador) -->
      <div class="mt-6 border-t border-gray-100 pt-6">
        <RecibosVerdesBenefits />
      </div>

      <!-- Campos CTI e Unipessoal -->
      <div class="grid grid-cols-1 gap-4">
        <!-- Campos CTI no estilo da imagem -->
        <div v-if="showCTIOptions" class="space-y-4">
          <!-- Localização -->
          <div>
            <label class="block text-sm font-medium text-orange-600 mb-2">
              {{ t.location }}
            </label>
            <div class="border border-orange-300 rounded px-3 py-1">
              <DropDown
                :value="ctiLocationLabel"
                :choices="[t.locationContinental, t.locationAzores, t.locationMadeira]"
                @change="handleLocationChange"
                data-cy="cti-location-dropdown"
                :no-border="true"
              />
            </div>
          </div>


          <!-- Situação (Estado Civil) -->
          <div>
            <label class="block text-sm font-medium text-orange-600 mb-2">
              {{ t.maritalStatus }}
              <InfoButton>
                <p class="text-sm w-64 text-center">
                  {{ t.maritalStatusTooltip }}
                </p>
              </InfoButton>
            </label>
            <div class="border border-orange-300 rounded px-3 py-1">
              <DropDown
                :value="ctiMaritalStatusLabel"
                :choices="[t.single, t.married]"
                @change="handleMaritalStatusChange"
                data-cy="cti-marital-status-dropdown"
                :no-border="true"
              />
            </div>
          </div>

          <!-- Titulares (só para casados) -->
          <div v-if="comparisonStore.ctiMaritalStatus === 'married'">
            <label class="block text-sm font-medium text-orange-600 mb-2">
              {{ t.holders }}
              <InfoButton>
                <p class="text-sm w-64 text-center">
                  {{ t.holdersTooltip }}
                </p>
              </InfoButton>
            </label>
            <div class="border border-orange-300 rounded px-3 py-1">
              <DropDown
                :value="ctiTitularesLabel"
                :choices="[t.holder1, t.holder2]"
                @change="handleTitularesChange"
                data-cy="cti-titulares-dropdown"
                :no-border="true"
              />
            </div>
          </div>

          <!-- Nº de dependentes -->
          <div>
            <label class="block text-sm font-medium text-orange-600 mb-2">
              {{ t.dependents }}
              <InfoButton>
                <p class="text-sm w-64 text-center">
                  {{ t.dependentsTooltip }}
                </p>
              </InfoButton>
            </label>
            <div class="border border-orange-300 rounded px-3 py-1">
              <FormattedNumberInput
                :value="comparisonStore.ctiDependents"
                @update:value="comparisonStore.setCtiDependents"
                placeholder="0"
                custom-class="w-full"
                :no-border="true"
              />
            </div>
          </div>
        </div>

        <div v-if="showCTIOptions">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t.mealCard }}
            <InfoButton>
              <p class="text-sm w-64 text-center">
                {{ t.mealCardTooltip }}
              </p>
            </InfoButton>
          </label>
          <FormattedNumberInput
            :value="internalMealCard"
            @update:value="internalMealCard = $event"
            :placeholder="t.monthly"
            custom-class="w-full"
          />
        </div>

        <!-- Unipessoal: Escolha entre Salário ou Distribuição de Lucros -->
        <div v-if="showUnipessoalOptions">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t.remunerationType }}
            <InfoButton>
              <p class="text-sm w-64 text-center">
                {{ t.remunerationTypeTooltip }}
              </p>
            </InfoButton>
          </label>
          <div class="flex gap-2">
            <button
              class="flex-1 px-4 py-2 text-sm border rounded transition"
              :class="{
                'bg-indigo-600 text-white border-indigo-600': !comparisonStore.unipessoalDistributeLucros,
                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': comparisonStore.unipessoalDistributeLucros,
              }"
              @click="comparisonStore.setUnipessoalDistributeLucros(false)"
            >
              💼 {{ t.salary }}
            </button>
            <button
              class="flex-1 px-4 py-2 text-sm border rounded transition"
              :class="{
                'bg-indigo-600 text-white border-indigo-600': comparisonStore.unipessoalDistributeLucros,
                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': !comparisonStore.unipessoalDistributeLucros,
              }"
              @click="comparisonStore.setUnipessoalDistributeLucros(true)"
            >
              💰 {{ t.profitDistribution }}
            </button>
          </div>
        </div>

        <div v-if="showUnipessoalOptions && !comparisonStore.unipessoalDistributeLucros">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ t.partnerSalary }}
              </label>
              <InfoButton>
                <p class="text-sm w-64 text-center">
                  {{ t.partnerSalaryTooltip }}
                </p>
              </InfoButton>
            </div>
            <button
              @click="optimizeSalary"
              class="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              :title="t.optimizeTooltip"
            >
              ✨ {{ t.optimize }}
            </button>
          </div>
          <FormattedNumberInput
            :value="internalUnipessoalSalary"
            @update:value="internalUnipessoalSalary = $event"
            :placeholder="t.partnerSalaryPlaceholder"
            custom-class="w-full"
          />
        </div>

        <div v-if="showUnipessoalOptions">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t.deductibleExpenses }}
          </label>
          <div class="flex items-center gap-2">
            <FormattedNumberInput
              :value="internalUnipessoalExpenses"
              @update:value="internalUnipessoalExpenses = $event"
              :placeholder="t.expensesPlaceholder"
              custom-class="flex-1"
              :disabled="comparisonStore.unipessoalExpensesAuto"
            />
            <button
              class="text-xs px-2 py-1 border rounded hover:bg-gray-100"
              :class="comparisonStore.unipessoalExpensesAuto ? 'bg-gray-200' : ''"
              @click="comparisonStore.setUnipessoalExpensesAuto(!comparisonStore.unipessoalExpensesAuto)"
            >
              {{ t.auto }}
            </button>
          </div>
          <div class="mt-2 flex items-center">
            <input
              id="expenses-liquidity-toggle"
              type="checkbox"
              :checked="comparisonStore.unipessoalExpensesAsLiquidity"
              @change="comparisonStore.setUnipessoalExpensesAsLiquidity(($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="expenses-liquidity-toggle" class="ml-2 block text-xs text-gray-600 select-none cursor-pointer">
              {{ t.considerAsLiquidity }}
            </label>
          </div>
        </div>
      </div>

      <!-- Despesas Adicionais (para Recibos Verdes e Unipessoal) -->
      <div v-if="showUnipessoalOptions" class="mt-6 pt-6 border-t">
        <h3 class="text-lg font-semibold mb-4">{{ t.additionalExpenses }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.accountant }}
            </label>
            <FormattedNumberInput
              :value="internalAccountantFee"
              @update:value="internalAccountantFee = $event"
              :placeholder="t.annualAmountPlaceholder"
              custom-class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.healthInsurance }}
            </label>
            <FormattedNumberInput
              :value="internalHealthInsurance"
              @update:value="internalHealthInsurance = $event"
              :placeholder="t.annualAmountPlaceholder"
              custom-class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.personalInsurance }}
            </label>
            <FormattedNumberInput
              :value="internalPersonalInsurance"
              @update:value="internalPersonalInsurance = $event"
              :placeholder="t.annualAmountPlaceholder"
              custom-class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.workInsurance }}
            </label>
            <FormattedNumberInput
              :value="internalWorkInsurance"
              @update:value="internalWorkInsurance = $event"
              :placeholder="t.annualAmountPlaceholder"
              custom-class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.otherExpenses }}
            </label>
            <FormattedNumberInput
              :value="internalOtherExpenses"
              @update:value="internalOtherExpenses = $event"
              :placeholder="t.annualAmountPlaceholder"
              custom-class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Resumo de Rendimentos (Bruto e Líquido em todas as frequências) -->
    <div v-if="comparisonStore.income && comparisonStore.income > 0" class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-indigo-900">{{ t.incomeSummary }}</h2>
      <p class="text-sm text-gray-600 mb-4">
        {{ t.incomeSummaryDescription }} {{ getFrequencyLabel(Object.keys(FrequencyChoices).find(k => FrequencyChoices[k] === comparisonStore.incomeFrequency) || 'Year').toLowerCase() }} {{ t.of }} 
        <span class="font-bold text-indigo-700">{{ internalIncome?.toLocaleString('pt-PT') }}€</span>
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Anual -->
        <div class="bg-white rounded-lg p-4 shadow-sm border-2" :class="comparisonStore.incomeFrequency === FrequencyChoices.Year ? 'border-indigo-500' : 'border-gray-200'">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-700">{{ t.annual }}</h3>
            <span v-if="comparisonStore.incomeFrequency === FrequencyChoices.Year" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{{ t.entry }}</span>
          </div>
          <div class="space-y-2">
            <div>
              <p class="text-xs text-gray-500">{{ t.gross }}</p>
              <p class="text-lg font-bold text-gray-900">{{ comparisonStore.grossIncome.year.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€</p>
              <p v-if="comparisonStore.vatEnabled" class="text-xs text-gray-500">
                + {{ t.vat }} (23%): {{ (comparisonStore.grossIncome.year * 0.23).toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€
              </p>
            </div>
            <div class="border-t pt-2">
              <p class="text-xs text-gray-500">{{ t.netEstimated }} ({{ t.recibosVerdes }})</p>
              <p class="text-lg font-bold text-green-600">{{ getEstimatedNetIncome('year').toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€</p>
            </div>
          </div>
        </div>

        <!-- Mensal -->
        <div class="bg-white rounded-lg p-4 shadow-sm border-2" :class="comparisonStore.incomeFrequency === FrequencyChoices.Month ? 'border-indigo-500' : 'border-gray-200'">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-700">{{ t.monthly }}</h3>
            <span v-if="comparisonStore.incomeFrequency === FrequencyChoices.Month" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{{ t.entry }}</span>
          </div>
          <div class="space-y-2">
            <div>
              <p class="text-xs text-gray-500">{{ t.gross }}</p>
              <p class="text-lg font-bold text-gray-900">{{ comparisonStore.grossIncome.month.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€</p>
              <p v-if="comparisonStore.vatEnabled" class="text-xs text-gray-500">
                + {{ t.vat }} (23%): {{ (comparisonStore.grossIncome.month * 0.23).toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€
              </p>
            </div>
            <div class="border-t pt-2">
              <p class="text-xs text-gray-500">{{ t.netEstimated }} ({{ t.recibosVerdes }})</p>
              <p class="text-lg font-bold text-green-600">{{ getEstimatedNetIncome('month').toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€</p>
            </div>
          </div>
        </div>

        <!-- Diário -->
        <div class="bg-white rounded-lg p-4 shadow-sm border-2" :class="comparisonStore.incomeFrequency === FrequencyChoices.Day ? 'border-indigo-500' : 'border-gray-200'">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-700">{{ t.daily }}</h3>
            <span v-if="comparisonStore.incomeFrequency === FrequencyChoices.Day" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{{ t.entry }}</span>
          </div>
          <div class="space-y-2">
            <div>
              <p class="text-xs text-gray-500">{{ t.gross }}</p>
              <p class="text-lg font-bold text-gray-900">{{ comparisonStore.grossIncome.day.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€</p>
              <p v-if="comparisonStore.vatEnabled" class="text-xs text-gray-500">
                + {{ t.vat }} (23%): {{ (comparisonStore.grossIncome.day * 0.23).toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€
              </p>
            </div>
            <div class="border-t pt-2">
              <p class="text-xs text-gray-500">{{ t.netEstimated }} ({{ t.recibosVerdes }})</p>
              <p class="text-lg font-bold text-green-600">{{ getEstimatedNetIncome('day').toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}€</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              <strong>{{ t.important }}:</strong> {{ t.importantNote }}
            </p>
            <ul class="text-xs text-yellow-600 mt-2 space-y-1 ml-4 list-disc">
              <li><strong>{{ t.recibosVerdes }}:</strong> {{ t.rvNote }}</li>
              <li><strong>{{ t.cti }}:</strong> {{ t.ctiNote }}</li>
              <li><strong>{{ t.unipessoal }}:</strong> {{ t.unipessoalNote }}</li>
            </ul>
            <p class="text-xs text-yellow-600 mt-2">
              💡 {{ t.tablesNote }} ({{ getFrequencyLabel(Object.keys(FrequencyChoices).find(k => FrequencyChoices[k] === comparisonStore.incomeFrequency) || 'Year') }}).
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de Comparação -->
    <div v-if="comparisonStore.income && comparisonStore.income > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ t.comparisonChart }}</h2>
      <ComparisonChart :comparisons="comparisonStore.allComparisons" />
    </div>

    <!-- Tabela de Comparação Detalhada -->
    <div v-if="comparisonStore.income && comparisonStore.income > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ t.detailedComparison }}</h2>
      <DetailedComparisonTable
        :comparisons="comparisonStore.allComparisons"
      />
    </div>

    <!-- Tabela de Comparação Resumida -->
    <div v-if="comparisonStore.income && comparisonStore.income > 0" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">{{ t.summaryComparison }}</h2>
      <ComparisonTable
        :comparisons="comparisonStore.allComparisons"
        :display-frequency="comparisonStore.displayFrequency"
      />
    </div>

    <!-- Informações Adicionais -->
    <div class="mt-8 bg-blue-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-4">{{ t.importantNotes }}</h3>
      
      <div class="bg-white rounded-lg p-4 mb-4 border-l-4 border-green-500">
        <h4 class="font-semibold text-green-700 mb-2">💚 {{ t.whyRVBetter }}</h4>
        <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
          <li>{{ t.coefficient075 }}</li>
          <li>{{ t.noIRC }}</li>
          <li>{{ t.noDividendIRS }}</li>
          <li>{{ t.lessBureaucracy }}</li>
        </ul>
        <div class="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
          <strong>{{ t.attention }}:</strong> {{ t.expensesWarning }}
        </div>
      </div>

      <ul class="space-y-3 text-sm text-gray-700">
        <li>
          <strong>{{ t.recibosVerdes }}:</strong> {{ t.rvBest }}
          <span class="text-xs text-gray-500 block mt-1">
            {{ t.rvAdditional }}
          </span>
        </li>
        <li>
          <strong>{{ t.ctiLong }}:</strong> {{ t.ctiBest }}
          <span class="text-xs text-gray-500 block mt-1">
            {{ t.ctiDeductions }}
          </span>
        </li>
        <li>
          <strong>{{ t.unipessoal }}:</strong> {{ t.unipessoalBest }}
          <span class="text-xs text-gray-500 block mt-1">
            {{ t.unipessoalOptions }}
          </span>
        </li>
        <li class="text-xs text-gray-500 mt-4 pt-3 border-t">
          <strong>{{ t.legalWarning }}:</strong> {{ t.legalWarningText }}
        </li>
      </ul>
    </div>

    <FooterBar class="print:hidden" />
  </div>
</template>

<style>
@media print {
  /* Ocultar elementos de navegação globais se existirem */
  nav, header, .navbar, .footer {
    display: none !important;
  }
  
  /* Garantir cores de fundo */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Ajustar layout para impressão */
  body {
    background-color: white !important;
    font-size: 12px;
  }

  .shadow-md {
    box-shadow: none !important;
    border: 1px solid #eee;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { FrequencyChoices } from "@/typings";
import { SUPPORTED_TAX_RANK_YEARS } from "@/store";
import { useComparisonStore } from "@/store/comparison";
import { useI18n } from "@/i18n";
import FormattedNumberInput from "@/components/FormattedNumberInput.vue";
import AdjustCounter from "@/components/AdjustCounter.vue";
import DropDown from "@/components/DropDown.vue";
import InfoButton from "@/components/InfoButton.vue";
import DetailedComparisonTable from "@/components/DetailedComparisonTable.vue";
import ComparisonTable from "@/components/ComparisonTable.vue";
import FooterBar from "@/components/FooterBar.vue";
import RecibosVerdesBenefits from "@/components/RecibosVerdesBenefits.vue";
import ComparisonChart from "@/components/ComparisonChart.vue";

const comparisonStore = useComparisonStore();
const { displayFrequency, currentTaxRankYear } = storeToRefs(comparisonStore);
const { t } = useI18n();

const internalIncome = ref<number | null>(null);
const internalUnipessoalSalary = ref<number | null>(null);
const internalUnipessoalExpenses = ref<number>(comparisonStore.unipessoalExpenses);
const internalMealCard = ref<number>(comparisonStore.ctiMealCard);
const internalAccountantFee = ref<number>(comparisonStore.accountantFee);
const internalHealthInsurance = ref<number>(comparisonStore.healthInsurance);
const internalPersonalInsurance = ref<number>(comparisonStore.personalInsurance);
const internalWorkInsurance = ref<number>(comparisonStore.workInsurance);
const internalOtherExpenses = ref<number>(comparisonStore.otherExpenses);

// Sincronizar com store
watch(internalIncome, (value) => {
  comparisonStore.setIncome(value);
});

watch(internalUnipessoalSalary, (value) => {
  comparisonStore.setUnipessoalSalary(value);
});

watch(internalUnipessoalExpenses, (value) => {
  comparisonStore.setUnipessoalExpenses(value);
});

// Atualizar despesas visuais quando em modo Auto
watch(
  () => [comparisonStore.unipessoalExpensesAuto, comparisonStore.grossIncome.year, comparisonStore.unipessoalSalary],
  ([isAuto, grossIncome, salary]) => {
    if (isAuto) {
      // Replicar lógica da store para visualização
      // 15% do bruto - 10% do salário (se houver)
      const s = salary || 0;
      // @ts-ignore
      const g = grossIncome || 0;
      const calculated = Math.max(0, g * 0.15 - s * 0.1);
      internalUnipessoalExpenses.value = calculated;
    }
  },
  { immediate: true }
);

watch(internalMealCard, (value) => {
  comparisonStore.setCtiMealCard(value);
});

watch(internalAccountantFee, (value) => {
  comparisonStore.setAccountantFee(value);
});

watch(internalHealthInsurance, (value) => {
  comparisonStore.setHealthInsurance(value);
});

watch(internalPersonalInsurance, (value) => {
  comparisonStore.setPersonalInsurance(value);
});

watch(internalWorkInsurance, (value) => {
  comparisonStore.setWorkInsurance(value);
});

watch(internalOtherExpenses, (value) => {
  comparisonStore.setOtherExpenses(value);
});

// Sincronizar frequência de exibição com frequência de entrada
watch(() => comparisonStore.incomeFrequency, (newFrequency) => {
  comparisonStore.setDisplayFrequency(newFrequency);
}, { immediate: true });

watch(() => comparisonStore.unipessoalExpensesAuto, (auto) => {
  if (auto && comparisonStore.income) {
    const salary = comparisonStore.unipessoalSalary || comparisonStore.income * 0.6;
    const expenses = Math.max(0, comparisonStore.income * 0.15 - salary * 0.1);
    internalUnipessoalExpenses.value = expenses;
    comparisonStore.setUnipessoalExpenses(expenses);
  }
});

const setIncomeFrequency = (frequencyChoice: string) => {
  comparisonStore.setIncomeFrequency(FrequencyChoices[frequencyChoice]);
};

const setDisplayFrequency = (frequencyChoice: string) => {
  comparisonStore.setDisplayFrequency(FrequencyChoices[frequencyChoice]);
};

const getFrequencyLabel = (frequencyChoice: string): string => {
  const labels = {
    Year: t.value.year,
    Month: t.value.month,
    Day: t.value.day,
  };
  return labels[frequencyChoice] || frequencyChoice;
};

const getFrequencyTitle = (frequencyChoice: string): string => {
  const titles = {
    Year: t.value.annual,
    Month: t.value.monthly,
    Day: t.value.daily,
  };
  return titles[frequencyChoice] || frequencyChoice;
};

const getIncomePlaceholder = computed(() => {
  const ex = t.value.example;
  const placeholders = {
    [FrequencyChoices.Year]: `${ex}: 60000`,
    [FrequencyChoices.Month]: `${ex}: 5000`,
    [FrequencyChoices.Day]: `${ex}: 242`,
  };
  return placeholders[comparisonStore.incomeFrequency] || t.value.incomePlaceholder;
});

const changeCurrentTaxRankYear = (
  taxRank: (typeof SUPPORTED_TAX_RANK_YEARS)[number],
) => {
  comparisonStore.setCurrentTaxRankYear(taxRank);
};

const showUnipessoalOptions = computed(() => {
  return comparisonStore.income && comparisonStore.income > 0;
});

const showCTIOptions = computed(() => {
  return comparisonStore.income && comparisonStore.income > 0;
});

// Labels para os dropdowns CTI
const ctiLocationLabel = computed(() => {
  switch (comparisonStore.ctiLocation) {
    case "continental":
      return t.value.locationContinental;
    case "islands":
      return t.value.locationAzores; // Por padrão, mas pode ser Açores ou Madeira
    default:
      return t.value.locationContinental;
  }
});

const ctiMaritalStatusLabel = computed(() => {
  return comparisonStore.ctiMaritalStatus === "single" ? t.value.single : t.value.married;
});

const ctiTitularesLabel = computed(() => {
  return comparisonStore.ctiTitulares === 1 ? t.value.holder1 : t.value.holder2;
});

// Handlers para mudanças nos dropdowns
const handleLocationChange = (choice: string) => {
  if (choice === t.value.locationContinental) {
    comparisonStore.setCtiLocation("continental");
  } else if (choice === t.value.locationAzores || choice === t.value.locationMadeira) {
    comparisonStore.setCtiLocation("islands");
  }
};

const handleMaritalStatusChange = (choice: string) => {
  if (choice === t.value.single) {
    comparisonStore.setCtiMaritalStatus("single");
  } else if (choice === t.value.married) {
    comparisonStore.setCtiMaritalStatus("married");
  }
};

const handleTitularesChange = (choice: string) => {
  if (choice === t.value.holder1) {
    comparisonStore.setCtiTitulares(1);
  } else if (choice === t.value.holder2) {
    comparisonStore.setCtiTitulares(2);
  }
};

// Função para obter o rendimento líquido estimado (usa Recibos Verdes como referência)
const getEstimatedNetIncome = (frequency: 'year' | 'month' | 'day'): number => {
  const comparison = comparisonStore.recibosVerdes;
  if (!comparison || !comparison.netIncome) {
    return 0;
  }
  // Usar finalNetIncome se disponível (após despesas adicionais), senão netIncome
  return comparison.finalNetIncome?.[frequency] || comparison.netIncome[frequency] || 0;
};

const optimizeSalary = () => {
  comparisonStore.optimizeUnipessoal();
  internalUnipessoalSalary.value = comparisonStore.unipessoalSalary;
};

const exportPdf = () => {
  window.print();
};
</script>

